Vue.component('cart',{
  template:
    `<nav class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Products</p>
          <p class="title">{{ cartCount }}</p>
          <a @click="toggleModal" class="button">
             View cart
          </a>
        </div>
      </div>
    </nav>`,
    props: ['cart', 'toggleModal', 'cartCount']
})
