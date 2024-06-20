import { defineStore } from "pinia"; 

export const useUtilStore = defineStore("util", {
    state: () => {
        return {
            base_url: "http://localhost:5000",
            post_url: "http://localhost:5000",
            // base_url: "http://192.168.175.205:5000/",
            // post_url: "http://192.168.175.205:5000/",
        };
    },
    persist: true,
})