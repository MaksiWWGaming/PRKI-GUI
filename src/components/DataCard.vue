<template>
  <div class="data-card h-100">
    <div class="card h-100 shadow-sm">
      <!-- Card Image -->
      <div v-if="image" class="card-img-container">
        <img
          :src="image"
          :alt="title"
          class="card-img-top"
          :class="{ loading: imageLoading }"
          @load="handleImageLoad"
          @error="handleImageError"
        />
        <div v-if="imageLoading" class="image-loading-overlay">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading image...</span>
          </div>
        </div>
        <div v-if="imageError" class="image-error-overlay">
          <i class="bi bi-image text-muted"></i>
          <small class="text-muted">Image not available</small>
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body d-flex flex-column">
        <!-- Title -->
        <h5 class="card-title text-capitalize mb-2">
          {{ title }}
          <span v-if="id" class="badge bg-secondary ms-2">#{{ id }}</span>
        </h5>

        <!-- Description -->
        <p v-if="description" class="card-text text-muted flex-grow-1">
          {{ truncatedDescription }}
          <button
            v-if="
              description.length > maxDescriptionLength && !showFullDescription
            "
            class="btn btn-link btn-sm p-0 ms-1"
            @click="showFullDescription = true"
          >
            Read more
          </button>
          <button
            v-if="
              showFullDescription && description.length > maxDescriptionLength
            "
            class="btn btn-link btn-sm p-0 ms-1"
            @click="showFullDescription = false"
          >
            Show less
          </button>
        </p>

        <!-- Metadata -->
        <div
          v-if="metadata && Object.keys(metadata).length > 0"
          class="card-metadata mb-3"
        >
          <div class="row g-2">
            <div
              v-for="(value, key) in displayMetadata"
              :key="key"
              class="col-6"
            >
              <small class="text-muted d-block">{{ formatKey(key) }}</small>
              <span class="fw-medium">{{ formatValue(value) }}</span>
            </div>
          </div>
        </div>

        <!-- Tags/Categories -->
        <div v-if="tags && tags.length > 0" class="card-tags mb-3">
          <div class="d-flex flex-wrap gap-1">
            <span
              v-for="tag in tags"
              :key="tag"
              class="badge"
              :class="getTagClass(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="showActions" class="card-actions mt-auto">
          <div class="d-flex gap-2 flex-wrap">
            <button
              v-if="showViewButton"
              class="btn btn-primary btn-sm"
              @click="handleView"
              :disabled="loading"
            >
              <i class="bi bi-eye me-1"></i>
              View Details
            </button>

            <!-- Custom action buttons -->
            <button
              v-for="action in customActions"
              :key="action.key"
              class="btn btn-sm"
              :class="action.class || 'btn-outline-primary'"
              @click="handleCustomAction(action)"
              :disabled="loading || action.disabled"
              :title="action.title"
            >
              <i v-if="action.icon" :class="action.icon" class="me-1"></i>
              {{ action.label }}
            </button>
          </div>
        </div>

        <!-- Loading overlay -->
        <div v-if="loading" class="card-loading-overlay">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Props
const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  metadata: {
    type: Object,
    default: () => ({}),
  },
  tags: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  showViewButton: {
    type: Boolean,
    default: true,
  },
  maxDescriptionLength: {
    type: Number,
    default: 150,
  },
  maxMetadataItems: {
    type: Number,
    default: 4,
  },
  customActions: {
    type: Array,
    default: () => [],
  },
});

// Emits
const emit = defineEmits(["view", "edit", "delete", "custom-action"]);

// State
const imageLoading = ref(true);
const imageError = ref(false);
const showFullDescription = ref(false);

// Computed
const truncatedDescription = computed(() => {
  if (!props.description) return "";
  if (
    showFullDescription.value ||
    props.description.length <= props.maxDescriptionLength
  ) {
    return props.description;
  }
  return props.description.substring(0, props.maxDescriptionLength) + "...";
});

const displayMetadata = computed(() => {
  if (!props.metadata) return {};
  const entries = Object.entries(props.metadata);
  if (entries.length <= props.maxMetadataItems) {
    return props.metadata;
  }
  return Object.fromEntries(entries.slice(0, props.maxMetadataItems));
});

// Methods
function handleImageLoad() {
  imageLoading.value = false;
  imageError.value = false;
}

function handleImageError() {
  imageLoading.value = false;
  imageError.value = true;
}

function handleView() {
  emit("view", { id: props.id, title: props.title });
}

function handleEdit() {
  emit("edit", { id: props.id, title: props.title });
}

function handleDelete() {
  emit("delete", { id: props.id, title: props.title });
}

function handleCustomAction(action) {
  emit("custom-action", {
    action: action.key,
    data: { id: props.id, title: props.title },
    actionConfig: action,
  });
}

function formatKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function formatValue(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  return String(value);
}

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch {
    return dateString;
  }
}

function getTagClass(tag) {
  // Simple color assignment based on tag content
  const colors = [
    "bg-primary",
    "bg-secondary",
    "bg-success",
    "bg-info",
    "bg-warning text-dark",
    "bg-danger",
    "bg-dark",
  ];
  const index = tag.length % colors.length;
  return colors[index];
}
</script>

<style scoped>
.data-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.data-card:hover {
  transform: translateY(-2px);
}

.data-card:hover .card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card-img-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  background-color: #f8f9fa;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.card-img-top.loading {
  opacity: 0.5;
}

.image-loading-overlay,
.image-error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(248, 249, 250, 0.9);
}

.image-error-overlay i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
}

.card-text {
  font-size: 0.9rem;
  line-height: 1.4;
}

.card-metadata {
  font-size: 0.85rem;
}

.card-metadata .text-muted {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-tags .badge {
  font-size: 0.7rem;
  font-weight: 500;
}

.card-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  padding-top: 1rem;
  margin-top: 1rem;
}

.card-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
}

.btn-link {
  color: var(--bs-primary);
  text-decoration: none;
  font-size: inherit;
}

.btn-link:hover {
  color: var(--bs-primary);
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .card-img-container {
    height: 150px;
  }

  .card-actions .d-flex {
    flex-direction: column;
  }

  .card-actions .btn {
    width: 100%;
    margin-bottom: 0.25rem;
  }
}
</style>