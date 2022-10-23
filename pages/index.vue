<template>
  <v-container>
    <v-card v-if="!loading" elevation="2">
      <v-alert v-if="error" dense outlined type="error">
        {{error}}
      </v-alert>
      <ul class="texts-container">
        <v-list-item v-for="(item, index) in texts" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{item.text}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </ul>
      <v-form v-model="formValid" class="pa-6" @submit="submitForm">
        <h3 class="mt-5">Enter Text</h3>
        <v-text-field v-model="text" class="text-input mt-2" label="Enter Text" :rules="rules" hide-details="auto">
        </v-text-field>
        <v-card-actions class="d-flex justify-end pa-0">
          <v-btn
:disabled="submittingForm || !formValid" type="submit" elevation="2" text color="deep-purple accent-4"
            class="mt-6">
            {{ !submittingForm ? "Submit" : 'Submitting'}}
            <v-progress-circular v-show="submittingForm" class="ml-6" indeterminate color="primary"></v-progress-circular>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <v-progress-circular v-if="loading" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
  </v-container>
</template>

<script>
import { initializeApp } from "firebase/app";
import * as functions from 'firebase/functions'
import { getFirestore, onSnapshot, query, collection } from 'firebase/firestore'

export default {
  name: 'HomePage',
  data: () => ({
    app: null,
    error: null,
    unsubscribeTextsQuery: () => { },
    text: "",
    texts: [],
    loading: true,
    submittingForm: false,
    formValid: false,
    rules: [
      value => !!value || 'Required.',
      value => (value && value.length >= 3) || 'Min 3 characters',
    ],
  }),
  mounted() {
    this.loading = true;
    this.app = initializeApp({
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
      measurementId: process.env.measurementId,
    })
    const db = getFirestore();

    const q = query(collection(db, 'texts'))
    this.unsubscribeTextsQuery = onSnapshot(q, (querySnapshot) => {
      this.texts = querySnapshot.docs.map(f => ({
        ...f.data(),
        id: f.id
      })).sort((a, b) => a.date - b.date)

      this.loading = false;
    }, (_error) => {
      this.loading = false;
      this.error = "Failed to load texts."
    });

  },
  
  destroyed() {
    if (unsubscribeTextsQuery) unsubscribeTextsQuery();
  },
  methods: {
    submitForm(e) {
      e.preventDefault();
      this.error = null;

      this.submittingForm = true;

      functions.connectFunctionsEmulator(functions.getFunctions(this.app), "localhost", 5001);

      const saveText = functions.httpsCallable(functions.getFunctions(this.app), 'saveText')

      saveText({
        text: this.text
      }).then(() => {
        this.text = ""
      }).catch(() => {
        this.error = "Failed to submit text."
      }).finally(() => {
        this.submittingForm = false;
      });

    }
  }
}
</script>


<style lang="scss">
.container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .v-card {
    width: 300px;
    max-height: 100vh;

    .texts-container {
      max-height: calc(100vh * 0.5);
      overflow-y: scroll;
    }
  }
}
</style>