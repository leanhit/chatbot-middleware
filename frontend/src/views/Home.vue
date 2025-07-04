<template>
    <div class="min-h-screen bg-white">
        home
    </div>
</template>

<script lang="ts">
import { reactive } from 'vue';

export default {
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        return {
        };
    },
};
</script>
