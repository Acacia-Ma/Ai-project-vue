import { defineStore } from "pinia"; 

export const useUtilStore = defineStore("util", {
    state: () => {
        return {
            base_url: "http://localhost:5000",
            post_url: "http://localhost:5000",
        };
    },
    persist: true,
})