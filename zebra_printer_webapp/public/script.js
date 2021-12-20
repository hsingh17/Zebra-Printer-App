const 
    BACKSPACE_CODE = 8,
    ZERO_CODE = 48,
    NINE_CODE = 57,
    DECIMAL_POINT_LEN = 2, 
    MAX_PRICE = 1000

let digits = 0

let handle_price_enter = (e) => {
    let key = e.keyCode
    let is_num = (key >= ZERO_CODE && key <= NINE_CODE)   //  Key value must be between 48 and 57 to be a number
    let is_bspace = (key === BACKSPACE_CODE)
    let product_price_tag = document.getElementsByName("product-price")[0]
    
    e.preventDefault()  // Prevent default action of inputting character into input field
    if (is_bspace) {
        let price = parseFloat(product_price_tag.value) / 10 // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
        let trunc_price = Math.trunc(price * 100) / 100 //https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding
        if (trunc_price !== 0) 
            product_price_tag.value = `${trunc_price}`
        else 
            product_price_tag.value = '0.00'
    }

    if (!is_num) return
    
    let num = key - ZERO_CODE    
    let price = parseFloat(product_price_tag.value)
    let new_price = price = (price * 10) + (0.01 * num)  // Shift over by 1 and add new number
    if (new_price >= MAX_PRICE) return   // Don't allow prices greater than 1000
    product_price_tag.value = price.toFixed(2)
}

// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
let constraints = {
    video : {
        width : {max : 640},
        height : {max : 480},
        facingMode : "environment"

    }
}   // TODO: make it prefer the rear camera

let load_media = async () => {
    try {
        let stream = await navigator.mediaDevices.getUserMedia(constraints)
        let video_tag = document.querySelector('video')
        video_tag.srcObject = stream
        video_tag.onloadedmetadata = (e) => {
            video_tag.play()
            Quagga.init({
                inputStream : {
                    name : 'Live',
                    type : 'LiveStream',
                    target : video_tag
                },
                decoder : {
                    readers : ['upc_reader'],
                    locate : true
                }
            }, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
                console.log('Quagga Initialization Complete')
                Quagga.start()
            })
        }
    } catch(e) {
        console.error(e)
    }
}

window.onload = load_media

Quagga.onDetected((data) => {
    console.log(data.codeResult.code)
})

Quagga.onProcessed((data) => {
    if (data === undefined || data.codeResult === undefined) return
    let upc_tag = document.getElementsByName("product-upc")[0]
    upc_tag.value = data.codeResult.code
})
