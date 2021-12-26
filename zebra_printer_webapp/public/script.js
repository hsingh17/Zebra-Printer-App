const 
    BACKSPACE_CODE = 8,
    ZERO_CODE = 48,
    NINE_CODE = 57,
    DECIMAL_POINT_LEN = 2, 
    MAX_PRICE = 1000


let handle_price_enter = (e) => {
    let key = e.keyCode
    let is_num = (key >= ZERO_CODE && key <= NINE_CODE)   //  Key value must be between 48 and 57 to be a number
    let is_bspace = (key === BACKSPACE_CODE)
    let product_price_tag = document.getElementsByName('product-price')[0]
    
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
        facingMode : 'environment'
    }
}   

let load_media = async () => {
    try {
        let stream = await navigator.mediaDevices.getUserMedia(constraints)
        let video_tag = document.querySelector('video')
        let btn = document.getElementsByName('video_btn')[0]
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
                    readers : ['upc_reader', 'ean_8_reader'],
                    locate : true
                }
            }, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
                console.log('Quagga Initialization Complete')
                btn.value = 'Stop Scanning'
                btn.onclick = stop_media
                Quagga.start()
            })
        }
    } catch(e) {
        console.error(e)
    }
}

let stop_media = () => {
    let video_tag = document.querySelector('video')
    let btn = document.getElementsByName('video_btn')[0] 
    video_tag.pause()   // Pause video player
    video_tag.srcObject = null  // Remove video source
    btn.value = 'Start Scanning'  // Change btn to start scanning
    btn.onclick = load_media    //Change button's onclick
    Quagga.stop()   // Stop Quagga
}

Quagga.onProcessed((data) => {
    if (data === undefined || data.codeResult === undefined) return
    let upc_tag = document.getElementsByName('product-upc')[0]
    upc_tag.value = data.codeResult.code
    stop_media()
})


let form_handler = () => {
    let form = document.getElementsByTagName('form')[0]
    form.submit()
    form.reset()
}