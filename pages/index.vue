<template>
  <v-container>
    <form @submit="submitForm">
      <v-card elevation="2" class="pa-10">
        <v-text-field v-model="text" class="text-input" label="Enter Text" :rules="rules" hide-details="auto">
        </v-text-field>
        <v-card-actions class="d-flex justify-end pa-0">
          <v-btn :disabled="loading" type="submit" elevation="2" text color="deep-purple accent-4" class="mt-6">
            {{ !loading ? "Submit" : 'Submitting'}}
            <v-progress-circular v-show="loading" class="ml-6" indeterminate color="primary"></v-progress-circular>
          </v-btn>
        </v-card-actions>
      </v-card>
    </form>
  </v-container>
</template>

<script>
import { initializeApp, } from "firebase/app";
import * as functions from 'firebase/functions'


const firebaseConfig = {
  apiKey: "AIzaSyB2dwge8Rtw7dfPEGgpO8z12NP0qvYxIEo",
  authDomain: "mamamia-28719.firebaseapp.com",
  projectId: "mamamia-28719",
  storageBucket: "mamamia-28719.appspot.com",
  messagingSenderId: "621139266928",
  appId: "1:621139266928:web:3a4b7b81b4f94c235bd3b5",
  measurementId: "G-CMR10ESX6T"
};


export default {
  name: 'IndexPage',
  data: () => ({
    app: initializeApp(firebaseConfig),
    text: "",
    loading: false,
    rules: [
      value => !!value || 'Required.',
      value => (value && value.length >= 3) || 'Min 3 characters',
    ],
  }),
  methods: {
    submitForm(e) {
      e.preventDefault();

      this.loading = true;


      functions.connectFunctionsEmulator(functions.getFunctions(this.app), "localhost", 5001);

      const saveText = functions.httpsCallable(functions.getFunctions(this.app), 'saveText')

      saveText({
        text: this.text
      }).finally(() => {
        this.loading = false;
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
}
</style>