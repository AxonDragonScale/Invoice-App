<script>
// SideNav Component
export default {
  name: "SideNav",
  props: ["name", "company"],
  methods: {
    // parent is this component, whose parent is Dashboard, this will update Dashboard
    setActive(option) {
      this.$parent.$parent.isactive = option;
    },

    // openNav and closeNav implement collapsible functionality
    openNav() {
      document.getElementById("leftSideNav").style.width = "20%";
    },

    closeNav() {
      document.getElementById("leftSideNav").style.width = "0%";
    }
  }
};
</script>

<template>
  <div>
    <span style="font-size: 30px; cursor: pointer" v-on:click="openNav">&#9776;</span>
    <div id="leftSideNav" class="SideNav">
      <p style="font-size: 30px; cursor: pointer" v-on:click="closeNav">
        <em>Close Nav</em>
      </p>
      <p>
        <em>company: {{ company }}</em>
      </p>
      <h3>Welcome, {{ name }}</h3>
      <p class="clickable" v-on:click="setActive('create')">Create Invoice</p>
      <p class="clickable" v-on:click="setActive('view')">View Invoices</p>
    </div>
  </div>
</template>

