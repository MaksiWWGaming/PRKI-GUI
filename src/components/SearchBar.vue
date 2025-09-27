<template>
    <div class="search-bar-container">
        <div class="input-group">
            <!-- Search input -->
            <input :id="inputId" ref="searchInput" type="text" class="form-control" :class="inputClass"
                :placeholder="placeholder" :value="modelValue" :disabled="disabled" :readonly="readonly"
                @input="handleInput" @focus="handleFocus" @blur="handleBlur" @keydown.enter="handleEnter"
                @keydown.escape="handleEscape" autocomplete="off">

            <!-- Search button -->
            <button class="btn btn-outline-secondary" :class="buttonClass" type="button" :disabled="disabled"
                @click="handleSearch" :title="searchButtonTitle">
                <i v-if="!isLoading" class="bi bi-search"></i>
                <div v-else class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Searching...</span>
                </div>
            </button>

            <!-- Clear button (shown when there's text) -->
            <button v-if="modelValue && showClearButton" class="btn btn-outline-secondary" type="button"
                :disabled="disabled" @click="handleClear" title="Clear search">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>

        <!-- Search suggestions/results count -->
        <div v-if="showResultsInfo && (resultsCount !== null || suggestions.length > 0)" class="search-info mt-2">
            <!-- Results count -->
            <small v-if="resultsCount !== null" class="text-muted">
                <i class="bi bi-info-circle me-1"></i>
                {{ resultsCount === 0 ? 'No results found' : `${resultsCount} result${resultsCount === 1 ? '' : 's'}
                found` }}
            </small>

            <!-- Suggestions -->
            <div v-if="suggestions.length > 0" class="suggestions mt-2">
                <small class="text-muted d-block mb-1">Suggestions:</small>
                <div class="d-flex flex-wrap gap-1">
                    <button v-for="suggestion in suggestions" :key="suggestion"
                        class="btn btn-sm btn-outline-primary suggestion-btn"
                        @click="handleSuggestionClick(suggestion)">
                        {{ suggestion }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="alert alert-danger mt-2 py-2 mb-0">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

// Props
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Search...'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    readonly: {
        type: Boolean,
        default: false
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    showClearButton: {
        type: Boolean,
        default: true
    },
    showResultsInfo: {
        type: Boolean,
        default: true
    },
    resultsCount: {
        type: Number,
        default: null
    },
    suggestions: {
        type: Array,
        default: () => []
    },
    error: {
        type: String,
        default: ''
    },
    inputClass: {
        type: String,
        default: ''
    },
    buttonClass: {
        type: String,
        default: ''
    },
    searchButtonTitle: {
        type: String,
        default: 'Search'
    },
    debounceMs: {
        type: Number,
        default: 300
    },
    minLength: {
        type: Number,
        default: 0
    },
    maxLength: {
        type: Number,
        default: 100
    }
})

// Emits
const emit = defineEmits([
    'update:modelValue',
    'search',
    'clear',
    'focus',
    'blur',
    'input',
    'enter',
    'escape',
    'suggestion-click'
])

// Refs
const searchInput = ref(null)

// State
const isFocused = ref(false)
let debounceTimer = null

// Computed
const inputId = computed(() => `search-input-${Math.random().toString(36).substr(2, 9)}`)

// Methods
function handleInput(event) {
    const value = event.target.value

    // Length validation
    if (value.length > props.maxLength) {
        return
    }

    // Update v-model
    emit('update:modelValue', value)
    emit('input', value)

    // Debounced search
    if (props.debounceMs > 0) {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            if (value.length >= props.minLength) {
                emit('search', value)
            }
        }, props.debounceMs)
    } else if (value.length >= props.minLength) {
        emit('search', value)
    }
}

function handleSearch() {
    if (props.disabled || props.readonly) return

    const value = props.modelValue.trim()
    if (value.length >= props.minLength) {
        emit('search', value)
    }
}

function handleClear() {
    if (props.disabled || props.readonly) return

    emit('update:modelValue', '')
    emit('clear')
    emit('search', '') // Trigger search with empty value

    // Focus input after clearing
    nextTick(() => {
        if (searchInput.value) {
            searchInput.value.focus()
        }
    })
}

function handleFocus(event) {
    isFocused.value = true
    emit('focus', event)
}

function handleBlur(event) {
    isFocused.value = false
    emit('blur', event)
}

function handleEnter(event) {
    event.preventDefault()
    handleSearch()
    emit('enter', props.modelValue)
}

function handleEscape(event) {
    if (props.modelValue) {
        handleClear()
    } else {
        searchInput.value?.blur()
    }
    emit('escape', event)
}

function handleSuggestionClick(suggestion) {
    emit('update:modelValue', suggestion)
    emit('suggestion-click', suggestion)
    emit('search', suggestion)

    // Focus input after suggestion click
    nextTick(() => {
        if (searchInput.value) {
            searchInput.value.focus()
        }
    })
}

// Public methods (exposed to parent)
function focus() {
    searchInput.value?.focus()
}

function blur() {
    searchInput.value?.blur()
}

function clear() {
    handleClear()
}

// Expose methods to parent component
defineExpose({
    focus,
    blur,
    clear
})
</script>

<style scoped>
.search-bar-container {
    width: 100%;
}

.input-group {
    position: relative;
}

.form-control:focus {
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

.btn-outline-secondary {
    border-color: var(--bs-border-color);
}

.btn-outline-secondary:hover {
    background-color: var(--bs-secondary);
    border-color: var(--bs-secondary);
    color: white;
}

.suggestion-btn {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    transition: all 0.2s ease;
}

.suggestion-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-info {
    animation: fadeIn 0.3s ease;
}

.suggestions {
    animation: slideDown 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
    .input-group {
        flex-wrap: nowrap;
    }

    .suggestions .d-flex {
        flex-direction: column;
        align-items: stretch;
    }

    .suggestion-btn {
        margin-bottom: 0.25rem;
    }
}
</style>