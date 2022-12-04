import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
withdrawButton.onclick = withdraw
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance

console.log(ethers)

async function connect() {
    if (typeof window.ethereum != "undefined") {
        console.log("Hello, metamask. ")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("Connected!")
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log("Funding with " + ethAmount)
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTxMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log("error")
        }
    }
}

function listenForTxMine(transactionResponse, provider) {
    console.log("Mining " + transactionResponse.hash)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Complete with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTxMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
