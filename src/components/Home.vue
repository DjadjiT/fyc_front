<template>
    <div>
       <v-card width="500" class="mx-auto mt-9">
            <v-card-title>Search for a stock</v-card-title>
            <v-card-text>
                <v-autocomplete
                v-model="stockName"
                :items="stockNameList"
                item-text="company"
                item-value="codeUrl"
                outlined
                filled
                label="Search for a stock"
            ></v-autocomplete>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions justify="center">
            <v-btn large rounded @click="sendRequest()" color="success">Search</v-btn>
            <v-spacer></v-spacer>
            <v-radio-group v-model="algorithm" mandatory mx-5>
                <template v-slot:label>
                    <div>Choose an algorithm : </div>
                </template>
                <v-radio
                    v-for="algo in algorithms"
                    :key="algo"
                    :label="algo"
                    :value="algo"
                    ></v-radio>
                </v-radio-group>
            </v-card-actions>
        </v-card>
      
        <v-layout row ma-5 justify-center> 
            <v-flex xs12 sm5 md5 lg2 ma-2 v-for="request in requestHistory" :key="request.id">
                <v-card elevation="5" outlined text-wrap>
                    <v-card-title text-truncate>
                        {{request.stockName}}
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        •  <span class="green--text">Positive :  {{request.positiveFeeling}}</span>   <br>
                        •  <span class="red--text">Negative : {{request.negativeFeeling}}</span>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-subtitle text-truncate>
                        <v-container>
                            <v-row rows="12" justify="center">
                                <p ma-2> 
                                    Created on the {{request.creationTime}}
                                </p>
                            </v-row>
                            <v-row rows="12" justify="center">
                                <p>
                                    With the <strong>{{request.algorithm}}</strong> algorithm
                                </p>
                            </v-row>
                            <v-row rows="12" justify="center">
                                <v-btn class="green white--text" block depressed v-if="request.state=='DONE'"> {{request.state}}</v-btn>
                                <v-btn class="yellow white--text" block depressed v-else >{{request.state}} </v-btn>
                            </v-row>
                        </v-container>
                    </v-card-subtitle>
                </v-card>
            </v-flex>
        </v-layout> 
    </div>
</template>
<script>
import axios from 'axios'


export default {
    data: () => ({
      stockName: "",
      stockNameList : [],
      requestHistory : [],
      algorithms : ["Bayes", "Bert"],
      algorithm : "",
      baseUrl: "http://localhost:8080/",
      token: "",
      requestEndPoint: "request"
    }),
    methods: {
        fetchAllStockName(){
            var stocksEndPoint = "stocks"
            var list = []
            list = axios.get(this.baseUrl+stocksEndPoint)
            .then(function (response) {
                var stocksList = []
                response.data.forEach((element) => {
                    var codeUrl = element.codeUrl
                    var company = element.company
                    stocksList.push({company, codeUrl})
                })
                return stocksList
            })
            .catch(function (error) {
                console.log(error);
                // TODO alert
            });
            return list
        },
        fetchRequest(){
            var list = []
            this.loadToken()
            var header = { 
                headers: 
                    { 
                        Authorization: `Bearer ${this.token}`,
                        "Content-Type": "application/json"
                    }
                }
            list = axios.get(
                this.baseUrl+this.requestEndPoint, 
                header)
            .then(function (response) {
                var reqList = []
                var options = new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute:'numeric' })
                response.data.forEach((element) => {
                    var id = element.requestId
                    var stockName = element.stockName
                    var codeUrl = element.codeUrl
                    var creationTime = new Date(element.creationTime).toLocaleDateString('fr-FR', options)
                    var state = element.state
                    var positiveFeeling = element.positiveFeeling
                    var algorithm = element.algorithm
                    var negativeFeeling = element.negativeFeeling
                    reqList.push({id, stockName, codeUrl, creationTime, state, positiveFeeling, negativeFeeling, algorithm})
                })
                return reqList
            })
            .catch(function (error) {
                console.log(error);
            });
            return list
        },
        sendRequest(){
            var request = this.getStockFromName(this.stockName)
            axios.post(this.baseUrl+this.requestEndPoint, 
            {
                "stockName": request.company,
                "codeUrl": request.codeUrl,
                "algorithm": this.algorithm
            }, 
            { headers: 
                { 
                    Authorization: `Bearer ${this.token}` } 
            })
            .then(function (response) {
                console.log(response.data);
                setTimeout(() => {
                    location.reload()
                }, 1500)
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        showList(){
            console.log(this.stockName)
        },
        loadToken(){
            if(!this.token)
                if(localStorage.token)
                    this.token = localStorage.token
        },
        getStockFromName(name){

            for(var i = 0; i < this.stockNameList.length; i++){
                if(this.stockNameList[i].codeUrl == name)
                    return this.stockNameList[i]
            }
            throw "Cant't finde the stock"
        }
    },
    created(){
        if(!localStorage.token)
                this.$router.push({ path: '/' });

        try{
            this.fetchAllStockName().then((value) => {
                this.stockNameList = value
            })
            console.log("Fetched the stocks lists.")
        }catch(error){
            console.error("Can't fetch the list of stocks : "+error)
        }
        try{
            this.fetchRequest().then((value) => {
                this.requestHistory = value
            })
            console.log("Fetched the stocks lists.")
        }catch(error){
            console.error("Can't fetch the request history : "+error)
        }
    },
    mounted(){
        this.loadToken()
    },
    computed: {
        filteredStockName: function(){
            return this.stockNameList.filter((name) => {
                console.log(this.stockName)
                return name.includes(this.stockName)
            })
        }
    }
    
}
</script>