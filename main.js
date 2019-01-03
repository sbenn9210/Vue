Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
    <div class="product-image">
    <img v-bind:src="image" v-bind:alt="altText" />
  </div>
  <div class="product-info">
    <h1>{{ title }}</h1>
    <h3 v-show="onSale">{{ sale }}</h3>
    <p>{{ description }}</p>
    <p>Shipping: {{ shipping }}</p>
    <p v-show="inStock">In Stock</p>
    <P :class="{textDecoration: !inStock}">Out of Stock</P>
    <span><p v-show="onSale">On Sale!</p></span>

    <div v-for="(variant, index) in variants" :key="variant.variantId"
    class="color-box"
    :style="{ backgroundColor: variant.variantColor }"
    @mouseover="updateProduct(index)">
    </div>

    <div>
      <ul v-for="size in sizes">
        <li>{{size}}</li>
      </ul>
    </div>

    <button v-on:click="addToCart"
    :disabled="!inStock"
    :class="{disabledButton: !inStock}">Add to cart</button>
    <button @click="removeFromCart"
    :disabled="!inStock"
    :class="{disabledButton: !inStock}">Remove from cart</button>
    

    <!-- <p v-if="inventory >= 10">In Stock</p>
    <p v-else-if="inventory > 0 && inventory < 10">Almost sold out!</p>
    <p v-else>Out of Stock</p>
  </div> -->
</div>
    </div>
  `,
  data() {
    return {
      product: "Socks",
      brand: "Vue Mastery",
      onSale: false,
      description: "A pair of warm, fuzzy socks",
      selectedVariant: 0,
      altText: "This is a green pair of socks",
      inventory: 22,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],

      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./assets/vmSocks-green.jpg",
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "./assets/vmSocks-blue.jpg",
          variantQuantity: 20
        }
      ],
      sizes: ["small", "medium", "large", "extra large"]
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    updateProduct(index) {
      this.selectedVariant = index;
      console.log(index);
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    }
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      return this.brand + " " + this.product + " are on sale!";
    },
    shipping() {
      if (this.premium) {
        return "Free";
      } else {
        return 2.99;
      }
    }
  }
});

Vue.component("productDetails", {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <div>
    <ul>
      <li v-for="detail in details"> {{detail}}</li>
    </ul>
    </div>
  `
});

var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeFromCart(id) {
      this.cart.pop(id);
    }
  }
});