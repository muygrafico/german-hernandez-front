
(function () {
  Vue.component('item',{
    template:
      `<div class="column is-one-quarter">
        <div class="product">
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
            <button v-show="available" class="button is-primary">Add to cart</button>
            <span v-show="!available" class="button is-disabled">Product not available</span>
          </div>

        </div>
      </div>`,
  props: ['img', 'name', 'price', 'description', 'best_seller', 'available'],
  computed: {
    pic: function () {
      return this.img + '/' + Math.floor((Math.random() * 10) + 1);
    }
   }
  })

  Vue.component('store',{
    template:
      `<div class="columns is-multiline">
        <item
        :img="product.img"
        :name="product.name"
        :price="product.price"
        :description="product.description"
        :best_seller="product.best_seller"
        :available="product.available"
        v-for="(product, index) in products"></item>
      </div>`
      ,
    data() {
      return {
        categories: [],
        products: []
      }
    }, mounted(){
      axios.get('json/data.json').then(
        (response) => {
          this.categories = response.data.categories
          this.products = response.data.products
        })
    }
  })

  new Vue({el: '#storeApp'})

})();
