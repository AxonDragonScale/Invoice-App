<script>
import Header from "./Header";
import axios from "axios";

export default {
    name: "SignUp",
    components: {
        Header
    },

    data() {
        return {
            model: {
                name: "",
                email: "",
                password: "",
                c_password: "",
                company_name: ""
            },
            loading: "",
            status: ""
        };
    },

    methods: {
        validate() {
            // ensure that both the passwords match (c_password is confirm password)
            if(model.password != this.model.c_password) {
                return false;
            }
            return true;
        },

        register() {
            const formData = new FormData();
            let valid = this.validate();

            if(valid) {
                // prepare data for submission
                formData.append("name", this.model.name);
                formData.append("email", this.model.email);
                formData.append("company_name", this.model.company_name);
                formData.append("password", this.model.password);

                this.loading = "Registering you, please wait";
                // post to server
                axios.post("http://localhost:8000/register", formData).then( res => {
                    this.loading = "";

                    // if success, send user to next route
                    if(res.data.status == true) {
                        this.$router.push({
                            name: "Dashboard",
                            params: {user: res.data.user }
                        });
                    } else {
                        this.status = res.data.message;
                    }
                });
            } else {
                alert("Passwords do not match");
            }
        },

        login() {
            const formData = new FormData();
            formData.append("email", this.model.email);
            formData.append("password", this.model.password);

            this.loading = "Signing in";

            // post to server
            axios.post("http://localhost:8000/login", formData).then( res => {
                this.loading = "";

                // if success, go to next route
                if(res.data.status == true) {
                    this.$router.push({
                        name: "Dashboard",
                        params: { user: res.data.user }
                    });
                } else {
                    this.status = res.data.message;
                }
            });
        }
    }

};
</script>


<template>
    <div>
        <div class="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="pills-login-tab">
            <div class="row">
                <div class="col-md-12">
                    <!-- instead of submit through a post, login() will be called -->
                    <form @submit.prevent="login">
                        <div class="form-group">
                            <label for="">Email:</label>
                            <input type="email" required class="form-control" placeholder="eg. ronak@invoiceapp.com" v-model="model.email">
                        </div>

                        <div class="form-group">
                            <label for="">Password:</label>
                            <input type="password" required class="form-control" placeholder="Enter password" v-model="model.password">
                        </div>

                        <div class="form-group">
                            <button class="btn btn-primary">Login</button>
                            {{ loading }}
                            {{ status }}
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="tab-pane fade" id="pills-register" role="tab-panel" aria-labelledby="pills-register-tab">
            <div class="row">
                <div class="col-md-12">
                    <!-- instead of submit through post, call register() -->
                    <form @submit.prevent="register">
                        <div class="form-group">
                            <label for="">Name:</label>
                            <input type="text" required class="form-control" placeholder="eg. ronak" v-model="model.name">
                        </div>

                        <div class="form-group">
                            <label for="">Email:</label>
                            <input type="email" required class="form-control" placeholder="eg. ronak@invoiceapp.com" v-model="model.email">
                        </div>

                        <div class="form-group">
                            <label for="">Company Name:</label>
                            <input type="text" required class="form-control" placeholder="eg. InvoiceApp" v-model="model.company_name">
                        </div>

                        <div class="form-group">
                            <label for="">Password:</label>
                            <input type="password" required class="form-control" placeholder="Enter Password" v-model="model.password">
                        </div>

                        <div class="form-group">
                            <label for="">Confirm Password:</label>
                            <input type="password" required class="form-control" placeholder="Confirm Password" v-model="model.c_password">
                        </div>

                        <div class="form-group">
                            <button class="btn btn-primary">Register</button>
                            {{ loading }}
                            {{ status }}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
