'use strict';

(function () {

  Vue.component('cart',{
    template:
      `<nav class="level is-mobile">

        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Products</p>
            <p class="title">{{ cart.length }}</p>
            <a @click="toggleModal" class="button">
               View cart
            </a>
          </div>
        </div>
      </nav>`,
      props: ['cart', 'toggleModal']
    })

    Vue.component('cartModal',{
      template:
        `<div>
          <cart :cart="cart" :toggleModal="toggleModal"></cart>
          <div class="modal cart-modal" v-bind:class="{ 'is-active': modalActive }">
            <div class="modal-background" @click="toggleModal"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Shoping cart</p>
                <button @click="toggleModal" class="delete"></button>
              </header>
              <section class="modal-card-body">
                <table class="table">
                  <tr>
                    <th>product</th>
                    <th>price</th>
                    <th>quantity</th>
                    <th></th>
                  </tr>
                  <tr v-for="product in cart">
                    <td>{{ product.name }}</td>
                    <td>{{ product.price }}</td>
                    <td><span class="product-quantity">{{ product.quantity }}</span></td>
                    <td><a class="button is-small" @click="addToCart(product)">+</a> <a @click="removeFromCart(product)" class="button is-small">-</a></td>
                  </tr>
                </table>
              </section>
              <footer class="modal-card-foot">
                <a class="button is-primary">
                  <i class="fa fa-credit-card-alt" aria-hidden="true"></i>
                  Procced to checkout
                </a>
                <a @click="toggleModal" class="button">Cancel</a>
              </footer>
            </div>
          </div>
        </div>`,
        data() {
         return {
           modalActive: false
         }
       },
       props: ['cart', 'removeFromCart', 'addToCart'],
       methods: {
         toggleModal: function() {
           this.modalActive = !this.modalActive
         }
       }
      })

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
          this.updateFilterText(this.filterText)
        }
      },
      props: ['updateFilterText', 'currentActiveFilterId']
    })

    Vue.component('filtersMenu',{
      template:
      `<aside class="menu filter-menu">
        <p class="menu-label"> Filters</p>
        <inputFilter
        :updateFilterText="this.updateFilterText"
        :currentActiveFilterId="currentActiveFilterId"></inputFilter>
        <ul class="menu-list">
          <li>
            <h5>Filters:</h5>
            <ul>
              <li v-for="filter in categories">
                <a
                v-bind:class="{ 'is-active': filter.id === currentActiveFilterId() }"
                @click="toggleActiveFilter({name: filter.name, id: filter.id })">{{ filter.name }}</a>
              </li>

            </ul>
          </li>
          <li>
            <h5>Order by:</h5>
            <ul>
              <li><a
                  v-bind:class="{ 'is-active': sortProductType === 'name' }"
                  @click="setSortProductType('name')">
                    Name
                  </a>
                </li>
              <li><a
                  v-bind:class="{ 'is-active': sortProductType === 'higher_price' }"
                  @click="setSortProductType('higher_price')">
                    Higher price
                  </a>
                </li>
              <li><a
                  v-bind:class="{ 'is-active': sortProductType === 'lower_price' }"
                  @click="setSortProductType('lower_price')">
                    Lower price
                  </a>
                </li>
            </ul>
          </li>
        </ul>
      </aside>`,
      props: [
        'categories',
        'updateFilterText',
        'toggleActiveFilter',
        'currentActiveFilterId',
        'setSortProductType',
        'sortProductType'
      ]
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
            <span
            v-for="category in productCategories"
            class="category-text tag">
              {{ findCategoryById(category) }}
            </span>
          </div>
        </div>
      </div>`,
      props: [
        'img',
        'name',
        'price',
        'description',
        'best_seller',
        'available',
        'id',
        'productCategories',
        'storeCategories'
      ],
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
        <cartModal :cart="cart" :addToCart="addToCart" :removeFromCart="removeFromCart"></cartModal>
        <div class="columns">
          <div class="column is-2">
            <filtersMenu
            :updateFilterText="this.updateFilterText"
            :toggleActiveFilter="toggleActiveFilter"
            :categories="categories"
            :currentActiveFilterId="currentActiveFilterId"
            :setSortProductType="setSortProductType"
            :sortProductType="sortProductType"
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
                <button class="button is-primary" @click="addToCart(product)">Add to cart</button>
              </product>
            </div>
          </div>
        </div>
      </div>`,
    data() {
      return {
        activeFilter: {name: '', id: 0},
        sortProductType: 'name',
        cart: [],
        categories: [],
        filteredProducts: [],
        filterText: '',
        products: []
      }
    }, mounted(){
      axios.get('json/data.json').then(
        (response) => {
          this.categories = response.data.categories
          this.products = response.data.products
          this.filteredProducts = this.products
          this.sortProducts()
        }
      )
    },
    methods: {
      addToCart: function (product) {
        var findResult = this.cart.find((p)=> {return p.id === product.id})
        if (findResult === undefined) {
          product.quantity = 1
          this.cart.push(product)
        } else {
          var pos = this.cart.map((e)=> {return e.id}).indexOf(product.id)

          if (this.cart[pos].quantity === 1){this.cart[pos].quantity = 2}
          else {this.cart[pos].quantity +=1}
          console.log(pos)
          console.log(this.cart[pos].quantity)
          console.log(this.cart)
          this.cart.sort()
        }
      },
      removeFromCart: function (product) {
        var pos = this.cart.map((e)=> {return e.id}).indexOf(product.id)
        if (this.cart[pos].quantity === 1){this.cart.splice(pos, 1)}
        else {this.cart[pos].quantity -=1}
        this.cart.sort()
        // console.log('removeFromCart',product.name )
      },
      filter: function(options) {
      //  console.log(this.activeFilter.id)
       this.filteredProducts = this.products.filter(el => {

         return el.categories.find((categoryId)=> {
           switch (this.activeFilter.id) {
             case 0:
              return el.name.toLowerCase().includes(this.filterText.toLowerCase())
              break
             case 1:
             case 2:
             case 3:
             case 4:
              return el.name.toLowerCase().includes(this.filterText.toLowerCase()) &&
                categoryId === this.activeFilter.id
              break
             case 5:
              return el.name.toLowerCase().includes(this.filterText.toLowerCase()) &&
              el.best_seller === true
              break
             case 6:
              return el.name.toLowerCase().includes(this.filterText.toLowerCase()) &&
              el.available === true
              break
             case 7:
              return el.name.toLowerCase().includes(this.filterText.toLowerCase()) &&
              el.available === false
              break
             case 8:
              return el.name.toLowerCase().includes(this.filterText.toLowerCase()) &&
              el.price > 30.000
              break
             case 9:
               return el.name.toLowerCase().includes(this.filterText.toLowerCase()) &&
               el.price < 10.000
               break

           }
         })
       });
       this.sortProducts
      },
      toggleActiveFilter: function(filterObj) {
        filterObj.id === this.activeFilter.id ?
         this.activeFilter = {name: '', id: 0} : this.activeFilter =  filterObj
      },
      currentActiveFilterId: function() {
        return this.activeFilter.id
      },
      updateFilterText: function(filterText) {
        this.filterText = filterText
        // console.log(this.filterText)
      },
      setSortProductType: function(type) {
        this.sortProductType = type
      },
      toNumber: function (badFormatedNumber){
        return parseFloat(badFormatedNumber, 10) * 1000
      },
      sortProducts: function() {
        switch (this.sortProductType) {
          case 'name':
            this.filteredProducts = this.filteredProducts.sort(function (a, b) {
              if (a.name.toLowerCase() > b.name.toLowerCase()) { return  1 }
              if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1 }
              return 0;
            });
            break;
          case 'higher_price':
            this.filteredProducts = this.filteredProducts.sort((a, b)=>{
              return this.toNumber(b.price)-this.toNumber(a.price)
            });
            break;
          case 'lower_price':
            this.filteredProducts = this.filteredProducts.sort((a, b)=>{
              return this.toNumber(a.price)-this.toNumber(b.price)
            })
            break;
        }
      },
    },
    watch: {
      filterText: function () { this.filter() },
      activeFilter: function () { this.filter() },
      sortProductType: function () { this.sortProducts() },
      cart: function () {}
    }
  })

  new Vue({el: '#storeApp'})

})()
