var eventBus = new Vue();

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
<div>
  <product-tabs :reviews="reviews"></product-tabs>
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
      sizes: ["small", "medium", "large", "extra large"],
      reviews: []
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
  },
  mounted() {
    eventBus.$on("review-submitted", productReview => {
      this.reviews.push(productReview);
    });
  }
});

Vue.component("product-review", {
  template: `
  
  <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{error}}
        </li>
      </ul>
    </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <p>
        <p>Would you recommend this product?</p>
        <label>
          Yes
        <input type="radio" v-model="recommend" value="Yes" checked>
        </label>
        <label>
          No
        <input type="radio" v-model="recommend" value="No">
        </label>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
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

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },

  template: `
    <div>
    <div>
    
      <span class="tab" :class="{activeTab: selectedTab === tab}" v-for="(tab, index) in tabs" @click="selectedTab = tab"  :key="index">{{ tab }}</span>
    
    </div>

    <div v-show="selectedTab === 'Reviews'">
    <p v-if="!reviews.length">There are no reviews yets.</p>
    <ul v-else>
      <li v-for="review in reviews">
        <p>{{ review.name }}</p>
        <p>Rating: {{ review.rating }}</p>
        <p>{{ review.review }}</p>
      </li>
    </ul>
  </div>

  <div>
    <product-review v-show="selectedTab === 'Make a Review'"></product-review>
  </div>
    </div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews"
    };
  }
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
