<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5 mb-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-6 fw-bold mb-3">Welcome to PokéDex Online!</h1>
            <p class="lead mb-4">
              Discover amazing Pokémon from the world of Pokémon! Browse through
              our collection, search for your favorites, and learn about their
              unique abilities and characteristics.
            </p>
            <div class="d-flex gap-3 flex-wrap">
              <router-link
                v-if="!authStore.isAuthenticated"
                to="/register"
                class="btn btn-light btn-lg"
              >
                <i class="bi bi-person-plus me-2"></i>
                Get Started
              </router-link>
              <router-link
                v-if="authStore.isAuthenticated"
                to="/dashboard"
                class="btn btn-light btn-lg"
              >
                <i class="bi bi-speedometer2 me-2"></i>
                Go to Dashboard
              </router-link>
              <button
                class="btn btn-outline-light btn-lg"
                @click="scrollToContent"
              >
                <i class="bi bi-arrow-down me-2"></i>
                Explore Pokémon
              </button>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <div class="hero-image">
              <i class="bi bi-lightning-charge-fill display-1 text-warning"></i>
              <h3 class="mt-3">Powered by PokeAPI</h3>
              <p>Real-time Pokémon data</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container" ref="contentSection">
      <!-- Search Section -->
      <section class="search-section mb-5">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card shadow-sm">
              <div class="card-body">
                <h3 class="card-title text-center mb-4">
                  <i class="bi bi-search me-2 text-primary"></i>
                  Find Your Favorite Pokémon
                </h3>
                <SearchBar
                  v-model="searchQuery"
                  placeholder="Search Pokémon by name..."
                  :is-loading="isSearching"
                  :results-count="searchResults.length"
                  :suggestions="searchSuggestions"
                  @search="handleSearch"
                  @clear="handleClearSearch"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="isLoading && !pokemonData.length" class="text-center py-5">
        <div
          class="spinner-border text-primary mb-3"
          style="width: 3rem; height: 3rem"
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
        <h4>Loading Pokémon...</h4>
        <p class="text-muted">Please wait while we fetch the latest data</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        <h4 class="alert-heading">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Oops! Something went wrong
        </h4>
        <p>{{ error }}</p>
        <hr />
        <button class="btn btn-outline-danger" @click="loadPokemon">
          <i class="bi bi-arrow-clockwise me-2"></i>
          Try Again
        </button>
      </div>

      <!-- Pokemon Grid -->
      <section v-else-if="displayedPokemon.length" class="pokemon-section">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3>
            <i class="bi bi-grid me-2 text-primary"></i>
            {{ searchQuery ? "Search Results" : "Pokémon Collection" }}
            <span class="badge bg-primary ms-2">{{
              displayedPokemon.length
            }}</span>
          </h3>

          <!-- View Toggle -->
          <div class="btn-group" role="group">
            <input
              type="radio"
              class="btn-check"
              name="viewMode"
              id="gridView"
              v-model="viewMode"
              value="grid"
            />
            <label class="btn btn-outline-primary" for="gridView">
              <i class="bi bi-grid-3x3-gap"></i>
            </label>

            <input
              type="radio"
              class="btn-check"
              name="viewMode"
              id="listView"
              v-model="viewMode"
              value="list"
            />
            <label class="btn btn-outline-primary" for="listView">
              <i class="bi bi-list"></i>
            </label>
          </div>
        </div>

        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="row g-4">
          <div
            v-for="pokemon in displayedPokemon"
            :key="pokemon.id"
            class="col-lg-4 col-md-6"
          >
            <DataCard
              :id="pokemon.id"
              :title="pokemon.name"
              :description="`Height: ${pokemon.height / 10}m | Weight: ${
                pokemon.weight / 10
              }kg`"
              :image="pokemon.image"
              :tags="pokemon.types"
              :metadata="{
                abilities: pokemon.abilities.slice(0, 2).join(', '),
                types: pokemon.types.join(', '),
              }"
              :show-edit-button="false"
              :show-delete-button="false"
              @view="handleViewPokemon"
            />
          </div>
        </div>

        <!-- List View -->
        <div v-else class="list-view">
          <div class="card">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Types</th>
                      <th>Height</th>
                      <th>Weight</th>
                      <th>Abilities</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="pokemon in displayedPokemon" :key="pokemon.id">
                      <td>
                        <img
                          :src="pokemon.image"
                          :alt="pokemon.name"
                          class="pokemon-thumb"
                          style="width: 50px; height: 50px; object-fit: cover"
                        />
                      </td>
                      <td>
                        <strong class="text-capitalize">{{
                          pokemon.name
                        }}</strong>
                        <br />
                        <small class="text-muted">#{{ pokemon.id }}</small>
                      </td>
                      <td>
                        <span
                          v-for="type in pokemon.types"
                          :key="type"
                          class="badge bg-secondary me-1"
                        >
                          {{ type }}
                        </span>
                      </td>
                      <td>{{ (pokemon.height / 10).toFixed(1) }}m</td>
                      <td>{{ (pokemon.weight / 10).toFixed(1) }}kg</td>
                      <td>
                        <small>{{
                          pokemon.abilities.slice(0, 2).join(", ")
                        }}</small>
                      </td>
                      <td>
                        <button
                          class="btn btn-sm btn-outline-primary"
                          @click="
                            handleViewPokemon({
                              id: pokemon.id,
                              title: pokemon.name,
                            })
                          "
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="!searchQuery && hasMore" class="text-center mt-5 mb-5">
          <button
            class="btn btn-primary btn-lg"
            @click="loadMorePokemon"
            :disabled="isLoadingMore"
          >
            <span
              v-if="isLoadingMore"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            <i v-else class="bi bi-plus-circle me-2"></i>
            {{ isLoadingMore ? "Loading..." : "Load More Pokémon" }}
          </button>
        </div>
      </section>

      <!-- Empty State -->
      <div v-else class="text-center py-5">
        <i class="bi bi-search fs-1 text-muted"></i>
        <h4 class="mt-3">No Pokémon Found</h4>
        <p class="text-muted">
          {{
            searchQuery
              ? `No results found for "${searchQuery}"`
              : "No Pokémon data available"
          }}
        </p>
        <button
          v-if="searchQuery"
          class="btn btn-primary"
          @click="handleClearSearch"
        >
          <i class="bi bi-arrow-left me-2"></i>
          Back to All Pokémon
        </button>
      </div>
    </div>

    <!-- Pokemon Detail Modal -->
    <div
      v-if="selectedPokemon"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-capitalize">
              <i class="bi bi-info-circle me-2"></i>
              {{ selectedPokemon.name }}
              <span class="badge bg-primary ms-2"
                >#{{ selectedPokemon.id }}</span
              >
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="selectedPokemon = null"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4 text-center">
                <img
                  :src="selectedPokemon.image"
                  :alt="selectedPokemon.name"
                  class="img-fluid mb-3"
                  style="max-height: 200px"
                />
                <div class="d-flex flex-wrap justify-content-center gap-1">
                  <span
                    v-for="type in selectedPokemon.types"
                    :key="type"
                    class="badge bg-primary"
                  >
                    {{ type }}
                  </span>
                </div>
              </div>
              <div class="col-md-8">
                <h6>Physical Characteristics</h6>
                <ul class="list-unstyled">
                  <li>
                    <strong>Height:</strong>
                    {{ (selectedPokemon.height / 10).toFixed(1) }} meters
                  </li>
                  <li>
                    <strong>Weight:</strong>
                    {{ (selectedPokemon.weight / 10).toFixed(1) }} kg
                  </li>
                </ul>

                <h6 class="mt-3">Abilities</h6>
                <ul>
                  <li
                    v-for="ability in selectedPokemon.abilities"
                    :key="ability"
                  >
                    {{ ability }}
                  </li>
                </ul>

                <h6 class="mt-3">Types</h6>
                <p>{{ selectedPokemon.types.join(", ") }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="selectedPokemon = null"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { pokemonAPI } from "@/services/api";
import SearchBar from "@/components/SearchBar.vue";
import DataCard from "@/components/DataCard.vue";

// Composables
const authStore = useAuthStore();

// Refs
const contentSection = ref(null);

// State
const pokemonData = ref([]);
const searchResults = ref([]);
const searchQuery = ref("");
const isLoading = ref(false);
const isSearching = ref(false);
const isLoadingMore = ref(false);
const error = ref("");
const viewMode = ref("grid");
const selectedPokemon = ref(null);
const currentOffset = ref(0);
const hasMore = ref(true);
const itemsPerPage = 20;

// Computed
const displayedPokemon = computed(() => {
  return searchQuery.value ? searchResults.value : pokemonData.value;
});

const searchSuggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return [];

  const query = searchQuery.value.toLowerCase();
  const suggestions = pokemonData.value
    .filter((pokemon) => pokemon.name.toLowerCase().includes(query))
    .slice(0, 5)
    .map((pokemon) => pokemon.name);

  return suggestions;
});

// Methods
async function loadPokemon() {
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    error.value = "";

    const data = await pokemonAPI.getPokemonWithDetails(
      itemsPerPage,
      currentOffset.value
    );

    if (currentOffset.value === 0) {
      pokemonData.value = data.results;
    } else {
      pokemonData.value.push(...data.results);
    }

    currentOffset.value += itemsPerPage;
    hasMore.value = data.results.length === itemsPerPage;
  } catch (err) {
    error.value = err.message || "Failed to load Pokémon data";
    console.error("Error loading Pokemon:", err);
  } finally {
    isLoading.value = false;
  }
}

async function loadMorePokemon() {
  if (isLoadingMore.value || !hasMore.value) return;

  try {
    isLoadingMore.value = true;

    const data = await pokemonAPI.getPokemonWithDetails(
      itemsPerPage,
      currentOffset.value
    );
    pokemonData.value.push(...data.results);
    currentOffset.value += itemsPerPage;
    hasMore.value = data.results.length === itemsPerPage;
  } catch (err) {
    error.value = err.message || "Failed to load more Pokémon";
    console.error("Error loading more Pokemon:", err);
  } finally {
    isLoadingMore.value = false;
  }
}

async function handleSearch(query) {
  if (!query || query.trim() === "") {
    handleClearSearch();
    return;
  }

  try {
    isSearching.value = true;
    error.value = "";

    const data = await pokemonAPI.searchPokemon(query.trim());
    searchResults.value = data.results;
  } catch (err) {
    error.value = err.message || "Search failed";
    console.error("Error searching Pokemon:", err);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
}

function handleClearSearch() {
  searchQuery.value = "";
  searchResults.value = [];
  error.value = "";
}

function handleViewPokemon(data) {
  const pokemon = displayedPokemon.value.find((p) => p.id === data.id);
  if (pokemon) {
    selectedPokemon.value = pokemon;
  }
}

function scrollToContent() {
  if (contentSection.value) {
    contentSection.value.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Lifecycle
onMounted(async () => {
  await loadPokemon();
});
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #0056b3 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="1" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.hero-image {
  position: relative;
  z-index: 1;
}

.search-section .card {
  border: none;
  border-radius: 1rem;
}

.pokemon-section {
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pokemon-thumb {
  border-radius: 0.5rem;
  transition: transform 0.2s ease;
}

.pokemon-thumb:hover {
  transform: scale(1.1);
}

.btn-check:checked + .btn-outline-primary {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: white;
}

.list-view .table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
  background-color: #f8f9fa;
}

.list-view .table-hover tbody tr:hover {
  background-color: rgba(var(--bs-primary-rgb), 0.05);
}

.modal.show {
  display: block;
}

.badge {
  font-size: 0.75rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    text-align: center;
  }

  .hero-section .col-lg-6:first-child {
    margin-bottom: 2rem;
  }

  .display-4 {
    font-size: 2.5rem;
  }

  .btn-group {
    flex-direction: column;
    width: 100%;
  }

  .btn-group .btn {
    border-radius: 0.375rem !important;
    margin-bottom: 0.25rem;
  }
}

@media (max-width: 576px) {
  .d-flex.gap-3 {
    flex-direction: column;
  }

  .d-flex.gap-3 .btn {
    width: 100%;
  }

  .table-responsive {
    font-size: 0.875rem;
  }

  .pokemon-thumb {
    width: 40px !important;
    height: 40px !important;
  }
}
</style>