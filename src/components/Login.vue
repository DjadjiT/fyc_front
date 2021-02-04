<template>
    <div>
      <v-card width="500" class="mx-auto mt-9">
        <v-card-title>Connect</v-card-title>
        <v-card-text>
          <v-text-field label="Username" prepend-icon="mdi-account-circle" v-model="username"/>
          <v-text-field 
          label="Password" 
          v-model="password"
          :type="showPwd ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPwd = !showPwd"/>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-btn large rounded @click="signUp()" color="success">Register</v-btn>
          <v-spacer></v-spacer>
          <v-btn large rounded color="info" @click="signIn()">Login</v-btn>
        </v-card-actions>
      </v-card>
    </div> 
</template>

<script>
import axios from 'axios'

export default {
    
  data: () => ({
      showPwd:false,
      username: "",
      password: "",
      baseUrl: "http://localhost:8080/"
  }),
  mounted: {
    
  },
  methods: {
    signIn(){
        try{
            this.sendSignIn(this.username, this.password).then((response) => {
                console.log(response)
                this.$router.push({ path: '/home' });
                }, (error) => {
                console.error(error);
                });
            
        }catch(error){
            console.error(error);
        }
    },
    async sendSignIn(username,password){
        var signInEndPoint = "auth/signin"
        return axios.post(this.baseUrl+signInEndPoint, {
            "username": username,
            "password": password
        })
        .then(function (response) {
            console.log(response.data)
            var token = response.data.token
            localStorage.token = token
        })
        .catch(function (error) {
            localStorage.token = ""
            throw error;
        });
    },
    signUp(){
      var signUpEndPoint = "auth/signUp"
      axios.post(this.baseUrl+signUpEndPoint, {
        "username": this.username,
        "password": this.password
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
        localStorage.token = ""
      });
    },
  }
}
</script>