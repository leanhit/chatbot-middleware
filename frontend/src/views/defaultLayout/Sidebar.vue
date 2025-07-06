<template>
    <div class="left side-menu">
        <button type="button" class="button-menu-mobile button-menu-mobile-topbar open-left waves-effect">
            <i class="ion-close"></i>
        </button>

        <!-- LOGO -->
        <div class="topbar-left navbar navbar-light position-relative">
            <div class="container-fluid">
                <router-link to="/home">
                    <a class="navbar-brand ml-auto m-auto" href="#">
                        <img src="/images/andromedawhile.png" alt="" width="130" height="47" />
                    </a>
                </router-link>
            </div>
        </div>

        <div class="sidebar-inner niceScrollleft">
            <div id="sidebar-menu">
                <ul>
                    <li class="menu-title"><strong>{{ t("Main") }}</strong></li>
                    <li class="has_sub">
                        <router-link to="/dashboard"><i class="mdi mdi-airplay"></i><span>
                                <strong>{{ t("Dashboard") }}</strong></span> <span class="float-right"></span></router-link>

                    </li>
                    <li class="has_sub">
                        <router-link to="/settings"><i class="mdi mdi-settings"></i><span>
                                <strong>{{ t("Settings") }}</strong></span> <span class="float-right"></span></router-link>

                    </li>
                    <!-- <li class="has_sub">
                        <a href="javascript:void(0);" class="waves-effect"><i class="mdi mdi-layers"></i> <span> Advanced UI
                            </span> <span class="float-right"><i class="mdi mdi-chevron-right"></i></span></a>
                        <ul class="list-unstyled">
                            <li><a href="advanced-highlight.html">Highlight</a></li>
                            <li><a href="advanced-rating.html">Rating</a></li>
                            <li><a href="advanced-alertify.html">Alertify</a></li>
                            <li><a href="advanced-rangeslider.html">Range Slider</a></li>
                        </ul>
                    </li>

                    <li>
                        <a href="calendar.html" class="waves-effect"><i class="mdi mdi-calendar-clock"></i><span> Calendar
                            </span></a>
                    </li> -->

                    <li class="menu-title"><strong>{{ t("Tool") }}</strong></li>
                    <li class="has_sub">
                        <router-link to="/menu"><i class="mdi mdi-food-variant"></i> <span>
                                <strong>{{ t("Menu") }}</strong></span> <span class="float-right"></span></router-link>

                    </li>
                    <li class="has_sub">
                        <router-link to="/zone-table"><i class="mdi mdi-seat-recline-normal"></i> <span>
                                <strong>{{ t("Zone/Table") }}</strong></span> <span
                                class="float-right"></span></router-link>
                    </li>

                    <li class="has_sub">
                        <router-link to="/activate-order-items">
                            <i class="mdi mdi-eye"></i>
                            <span><strong>{{ t("Watching") }}</strong></span>
                            <span class="float-right"></span>
                        </router-link>
                    </li>
                    <li class="has_sub">
                        <router-link to="/all-order">
                            <i class="mdi mdi-view-list"></i>
                            <span><strong>{{ t("All Order") }}</strong></span>
                            <span class="float-right"></span>
                        </router-link>
                    </li>


                    <li class="has_sub">
                        <router-link to="/bill"><i class="mdi mdi-note-text"></i> <span>
                                <strong>{{ t("Bill") }}</strong></span> <span class="float-right"></span></router-link>
                    </li>

                </ul>
            </div>
            <div class="clearfix"></div>
        </div> <!-- end sidebarinner -->
    </div>
</template>
    
<script lang="ts">
import { useI18n } from 'vue-i18n';

export default {
    setup() {
        const { t } = useI18n();
        return { t }
    }
};
</script>

    