# geneva
### visualizing the hydrogen atom with JavaScript

![image for (n, l, m) = (4, 2, 0)](https://i.ibb.co/2grJrjN/Screen-Shot-2021-08-18-at-21-49-33.png)
^ (n, l, m) = (4, 2, 0)

## Running the code
There are 2 ways you can run the code. It usually takes around 5-10 seconds for the graph to appear.

### 1. Testing it on CodePen
[CodePen Link](https://codepen.io/pilcrowOnPaper/pen/WNjqGMW)

After changing the values (if needed), click the "reload" button.
### 2. Hosting the website locally
This is built on Svelte. 

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

## Using the code
Change the value of `n_value`, `l_value`, `m_value` to change the shape.

Currently, `L_value`, the size of the box, is set as 15 * 15 * 15, showing coordinates with a probability density over 0.00001. You may need to change the `minimum_percent` when dealing with high n value (around half of the default). 
The bohr radius is set at 0.529177. You will need to change the `L_value` if you change the `bohr_radius_value`.

`factor` represents the number of points per unit (or `factor` cubed for the number per cube unit). 


