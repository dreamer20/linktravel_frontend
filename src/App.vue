<script setup>
import { reactive, ref, computed } from 'vue';
import ErrorPage from './components/ErrorPage.vue'

const apiURL = 'https://linktravel.onrender.com/'
const fetchedResources = ref([])
const links = ref([])

const options = reactive({
  onlyRoot: false,
  withoutSubdomain: false
})

const webpageURL = reactive({
  url: '',
  isInvalid: false,
  isFetched: false
})

const requestError = reactive({
  statusCode: null,
  text: '',
  isError: false
})

function checkInputValidation() {
  const regex = /^https?:\/\//g;
  if (!webpageURL.url.match(regex)) {
    return false
  }
  return true
}

function validateReset() {
  if (webpageURL.isInvalid) {
    webpageURL.isInvalid = false
  }
}

async function getWebpageLinks() {
  requestError.isError = false
  
  const isInputValid = checkInputValidation()
  
  if (!isInputValid) {
    webpageURL.isInvalid = true
    return
  }

  const params = {
    url: webpageURL.url,
    only_root: options.onlyRoot,
    without_subdomain: options.withoutSubdomain
  }

  const headers = {
    'Content-type': 'application/json'
  }
  webpageURL.isFetched = true
  fetch(apiURL, {
      body: JSON.stringify(params),
      method: 'POST',
      headers: headers
  }).then(response => {
    webpageURL.isFetched = false
    if (response.ok) {
      response.json().then(data => links.value = data)
    } else {
      response.json().then(error => {
        requestError.isError = true
        requestError.statusCode = response.status
        requestError.text = error.detail
      })
    }
  })
}

async function getLinks(link, level, showLinks) {
  const params = {
    url: link.url,
    only_root: options.onlyRoot,
    without_subdomain: options.withoutSubdomain
  }

  const headers = {
    'Content-type': 'application/json'
  }
  fetchedResources.value.push({[link.url]: level})
  fetch(apiURL, {
      body: JSON.stringify(params),
      method: 'POST',
      headers: headers
  }).then(response => {
      const i = fetchedResources.value.findIndex(o => o[link.url] === level)
      fetchedResources.value.splice(i,1)
      if (response.ok) {
        response.json().then(data => link.links = data)
        showLinks()
      } else {
        response.json().then(error => {
          link.links = [{error: true, errorText: error.detail}]
        })
      } 
    })
}

function toggleOnlyRoot() {
  if (options.onlyRoot === true && options.withoutSubdomain === true) {
    options.onlyRoot = false
    options.withoutSubdomain = false
  } else if (options.onlyRoot === true && options.withoutSubdomain === false) {
    options.onlyRoot = false
  } else {
    options.onlyRoot = true
  }
}

function toggleWithoutSubdomain() {
  if (options.onlyRoot === false && options.withoutSubdomain === false) {
    options.onlyRoot = true
    options.withoutSubdomain = true
  } else if (options.onlyRoot === true && options.withoutSubdomain === true) {
    options.withoutSubdomain = false
  } else {
    options.withoutSubdomain = true
  }
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col text-center mt-5">
        <h1>Link Travel</h1>
        <p class="lead">Check where links on webpage can lead you</p>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <div class="mx-auto" style="max-width: 600px;">
          <div
            class="input-group"
            :class="{'is-invalid': webpageURL.isInvalid}">
            <input
              v-model="webpageURL.url"
              @input="validateReset"
              class="form-control"
              :class="{'is-invalid': webpageURL.isInvalid}"
              placeholder="https://example.com"
              aria-label="https://example.com"
              type="text" />
            <button
              @click="getWebpageLinks"
              class="btn btn-primary"
              type="button">
              <template v-if="webpageURL.isFetched">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="ps-1">Loading...</span>
              </template>
              <span v-else>
                Get links
              </span>
            </button>
          </div>
          <div class="invalid-feedback">
              Seems like invalid URL adress.
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col text-center">
          <div
            @click.stop="toggleOnlyRoot"
            class="form-check form-check-inline">
            <input

              type="checkbox"
              class="form-check-input"
              id="onlyRootCheckbox"
              :checked="options.onlyRoot">
            <label
              @click.prevent
              class="form-check-label"
              for="onlyRootCheckbox">
              Only root
            </label>
          </div>
          <div
            @click.stop="toggleWithoutSubdomain" 
            class="form-check form-check-inline">
            <input

              :checked="options.withoutSubdomain"
              type="checkbox"
              class="form-check-input"
              id="withoutSubdomainCheckbox">
            <label
              @click.prevent 
              class="form-check-label"
              for="withoutSubdomainCheckbox">
              Without subdomain
            </label>
          </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ErrorPage
          v-if="requestError.isError"
          :status-code="requestError.statusCode"
          :text="requestError.text" />
        <LinkTree
          v-else
          :getLinks="getLinks"
          :links="links"
          :fetching="fetchedResources"
          :isVisible="true" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
