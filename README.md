# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


### Comment about some lines of code :

```Javascript
 Promise.all([
        web3.eth.getAccounts(),
        web3.eth.getChainId(),
        web3.eth.getBlockNumber()
     ])
```
Using the Promise.all method can be more time efficient when you have multiple independent promises that you want to wait for, as it allows you to wait for all of the promises to resolve in parallel rather than waiting for each promise to resolve sequentially.

For example, if you have three independent promises that each take one second to resolve, using Promise.all to wait for all three promises to resolve will take approximately one second, while using individual then statements to wait for each promise to resolve will take approximately three seconds.

However, it is important to note that using Promise.all may not always be the most efficient approach, as it can lead to increased memory usage if the resolved values of the promises are large. In such cases, it may be more efficient to use individual then statements to wait for the promises to resolve sequentially.

Ultimately, the most efficient approach will depend on the specific circumstances and the characteristics of the promises you are working with. It is a good idea to consider the trade-offs between parallelism and memory usage when deciding whether to use Promise.all or individual then statements to wait for multiple promises to resolve.


