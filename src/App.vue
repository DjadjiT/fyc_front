<template>
  <v-app>
    <v-app-bar app dark color="blue">
      <v-toolbar-title >Fyc</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="red" depressed mr-10 router :to="{path: '/'}" @click="disconnect()">
          <span >Disconnect</span>
      </v-btn>
    </v-app-bar>

    <v-main>
            
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  
  name: 'App',

  components: {
  },
  data: () => ({
  }),
  methods: {
    disconnect(){
        localStorage.token = ""
    }
  },
  mounted: {
    
  },
};
</script>
