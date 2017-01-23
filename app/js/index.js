'use strict';

(function () {

  Vue.component('inputFilter',{
    template:
      `<div class="input-filter">
        <p class="control">
          <input
          class="input"
          type="text"
          placeholder="Search"
          v-on:keyup="updateFilterText(filterText)"
          v-model="filterText">
          <a v-show="this.filterText !== ''" @click="resetFilterText" class="delete is-small"></a>
        </p>
      </div>`,
      data() {
        return {
          filterText: ''
        }
      },
      methods: {
        resetFilterText: function() {
          this.filterText = ''
          this.updateFilterText('')
        }
      },
      props: ['updateFilterText', 'currentActiveFilterId']
    })

    Vue.component('filtersMenu',{
      template:
      `<aside class="menu filter-menu">
        <p class="menu-label"> Filters</p>
        <inputFilter :updateFilterText="this.updateFilterText" :currentActiveFilterId="currentActiveFilterId"></inputFilter>
        <ul class="menu-list">
          <li>
            <h5>Filters:</h5>
            <ul>
              <li v-for="filter in categories">
                <a v-bind:class="{ 'is-active': filter.id === currentActiveFilterId() }" @click="toggleActiveFilter({name: filter.name, id: filter.id })">{{ filter.name }}</a>
              </li>
            </ul>
          </li>
          <li>
            <h5>Order by:</h5>
            <ul>
              <li><a>Name</a></li>
              <li><a>Higher price</a></li>
              <li><a>Lower price</a></li>
            </ul>
          </li>
        </ul>
      </aside>`,
      props: ['categories', 'updateFilterText', 'toggleActiveFilter','currentActiveFilterId']
    })

  Vue.component('product',{
    template:
      `<div class="column is-one-third">
        <div class="product" v-bind:class="{ unavailable: !available }">
          <div class="image">
            <span class="icon best-seller" v-show="best_seller">
              <i class="fa fa-star"></i>
            </span>
            <img :src="pic">
          </div>
          <div class="name">{{ name }}</div>
          <hr>
          <div class="description">
            {{ description }}
          </div>
          <div class="product-footer">
            <div class="price">$\{{ price }}</div>
          </div>
          <div class="button-container">
            <div v-show="available"><slot></slot></div>
            <span v-show="!available" class="button is-disabled">
              Not available
            </span>
          </div>
          <div class="product-categories">
            <span v-for="category in productCategories" class="category-text tag">{{ findCategoryById(category) }}</span>
          </div>
        </div>
      </div>`,
      props: ['img', 'name', 'price', 'description', 'best_seller', 'available', 'id', 'productCategories', 'storeCategories'],
      computed: {
        pic: function () {
          return this.img + '/' + Math.floor((Math.random() * 10) + 1)
        }
      },
      methods: {
        findCategoryById: function (id) {
          return this.storeCategories.filter(function(v) {
            return v.id === id
          })[0].name
        }
      }
    })

  Vue.component('store',{
    template:
      `<div class="store">
        <div class="columns">
          <div class="column is-2">
            <filtersMenu
            :updateFilterText="this.updateFilterText"
            :toggleActiveFilter="toggleActiveFilter"
            :categories="categories"
            :currentActiveFilterId="currentActiveFilterId"
            ><filtersMenu>
          </div>
          <div class="column">
            <div class="columns is-multiline">
              <product
              :img="product.img"
              :name="product.name"
              :price="product.price"
              :description="product.description"
              :best_seller="product.best_seller"
              :available="product.available"
              :id="product.id"
              :productCategories="product.categories"
              :storeCategories="categories"
              v-for="product in filteredProducts">
                <button class="button is-primary" @click="addToCart(product.id)">Add to cart</button>
              </product>
            </div>
          </div>
        </div>
      </div>`,
    data() {
      return {
        categories: [],
        products: [],
        filteredProducts: [],
        cart: [],
        activeFilter: {name: '', id: 0},
        filterText: ''
      }
    }, mounted(){
      axios.get('json/data.json').then(
        (response) => {
          this.categories = response.data.categories
          this.products = response.data.products
          this.filteredProducts = this.products
        }
      )
    },
    methods: {
      addToCart: function (productId) {
        this.cart.push(productId)
        console.log(this.cart)
      },
      filter: function(options) {
        console.log(this.activeFilter.id)
       this.filteredProducts = this.products.filter(el => {
         return el.categories.find((categoryId)=> {
           if (this.activeFilter.id === 0) {
             return el.name.toLowerCase().includes(this.filterText.toLowerCase())
           } else {
             return el.name.toLowerCase().includes(this.filterText.toLowerCase()) &&  categoryId === this.activeFilter.id
           }
         })
       });
     },
     toggleActiveFilter: function(filterObj) {
        filterObj.id === this.activeFilter.id ? this.activeFilter = {name: '', id: 0} : this.activeFilter =  filterObj
      },
      currentActiveFilterId: function() {
        return this.activeFilter.id
      },
      updateFilterText: function(filterText) {
        this.filterText = filterText
        console.log(this.filterText)
      }
    },
    watch: {
     filterText: function () {
      this.filter()
     },
      activeFilter: function () {
      this.filter()
     }
   }
  })

  new Vue({el: '#storeApp'})

})();
