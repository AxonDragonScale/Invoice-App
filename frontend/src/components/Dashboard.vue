<script>

import Header from "./Header";
import CreateInvoice from "./CreateInvoice";
import ViewInvoice from "./ViewInvoice";

export default {
    name: "Dashboard";
    components: {
        Header,
        CreateInvoice,
        ViewInvoice
    },

    data() {
        return {
            isactive: 'create',
            title: "Invoice App",
            user: (this.$route.params.user) ? this.$route.params.user : null
        };
    }
};
</script>

<template>
    <div class="container-fluid" style="padding: 0px;">
        <Header v-bind:user="user"></Header>
        <template v-if="this.isactive == 'create'">
            <CreateInvoice></CreateInvoice>
        </template>
        <template v-else>
            <ViewInvoice></ViewInvoice>
        </template>
    </div>
</template>
