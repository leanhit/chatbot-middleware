<script lang="ts">
import { defineAsyncComponent, ref, watch } from 'vue';
import SkeletonBox from '@/components/SkeletonBox.vue';

export default {
    components: {
        Navbar: defineAsyncComponent({
            loader: () => import('@/views/defaultLayout/Navbar.vue'),
            loadingComponent: SkeletonBox,
        }),
        Footer: defineAsyncComponent({
            loader: () => import('@/views/defaultLayout/Footer.vue'),
            loadingComponent: SkeletonBox,
        }),
    },
    setup() {
        return {
        }
    }
}
</script>
<template>
    <div>
        <!-- Begin page -->
        <div id="wrapper bg-secondary">
            <!-- Start right Content here -->
            <div class="content-page " style="width: 100%; margin-left: 0;">
                <!-- Start content -->
                <div class="content">
                    <!-- Top Bar Start -->
                    <div class="topbar">
                        <Navbar />
                    </div>
                    <!-- Top Bar End -->

                    <div>
                        <router-view />
                    </div>
                    <!-- Page content Wrapper -->

                </div> <!-- content -->


            </div>
            <!-- End Right content here -->

        </div>
        <!-- END wrapper -->
    </div>
</template>
