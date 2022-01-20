const 
    BACKSPACE_CODE = 8,
    ZERO_CODE = 48,
    NINE_CODE = 57,
    DECIMAL_POINT_LEN = 2, 
    MAX_PRICE = 1000,
    MAX_CHAR_NAME = 30
    CONSTRAINTS = { // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    audio : false,
    video : {
        width : {max : 640},
        height : {max : 480},
        facingMode : 'environment'
    }
}  

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

let load_media = async () => {
    try {
        let stream = await navigator.mediaDevices.getUserMedia(CONSTRAINTS)
        let video_tag = document.querySelector('video')
        enter_fullscreen()
        video_tag.srcObject = stream
        video_tag.onfullscreenchange = toggle_video
        video_tag.onloadedmetadata = video_loaded
    } catch(e) {
        console.error(e)
    }
}

let stop_media = () => {
    let video_tag = document.querySelector('video')
    video_tag.pause()   // Pause video player
    video_tag.srcObject = null  // Remove video source
    exit_fullscreen() // Exit fullscreen
    Quagga.stop()   // Stop Quagga
}

let form_handler = () => {
    let form = document.getElementsByTagName('form')[0]
    let product_name = document.getElementById('product-name').value
    if (product_name.length === 0) {
        toggle_alert('Enter a product name!')
    } else {
        form.submit()
        form.reset()
    }
}

let enter_fullscreen = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
    let video_tag = document.querySelector('video')
    if (video_tag.requestFullscreen) {
        video_tag.requestFullscreen();
    } else if (video_tag.mozRequestFullScreen) {
        video_tag.mozRequestFullScreen();
    } else if (video_tag.webkitRequestFullscreen) {
        video_tag.webkitRequestFullscreen();
    } else if (video_tag.msRequestFullscreen) {
        video_tag.msRequestFullscreen();
    }
}

let exit_fullscreen = () => {
    // https://stackoverflow.com/questions/9620223/make-div-fullscreen-onclick-of-a-button
    if (document.exitFullscreen){
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen){
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen){
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen){
        document.msExitFullscreen();
    }
}

let toggle_video = () => {
    let video_tag = document.querySelector('video')
    if (document.fullscreenElement) {
        video_tag.style.display = 'block'
    } else {
        video_tag.style.display = 'none'
    }
}

let video_loaded = () => {
    let video_tag = document.querySelector('video')
    video_tag.play()
    init_quagga()
}

let init_quagga = () => {
    let video_tag = document.querySelector('video')
    Quagga.init({
        inputStream : {
            name : 'Live',
            type : 'LiveStream',
            target : video_tag,
            constraints : CONSTRAINTS
        },
        decoder : {
            readers : ['upc_reader', 'upc_e_reader'],
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

let toggle_alert = (msg) => {
    // Turn on user alert to notify user of error
    let alert = document.getElementById('product-alert-init')
    let alert_msg = document.getElementById('alert-msg')
    alert_msg.textContent = msg // Add alert's message
    alert.id = 'product-alert-on'   // Turn on alert
    setTimeout(() => { alert.id = 'product-alert-init' }, 2000)    // Turn off after 2s
}

let fetch_name_suggestion = async (upc) => {
    let loading_div = document.getElementById('product-alert-loading')
    loading_div.style.opacity = '100%'  // Turn on loading notification
    let res = await fetch(`/name/${upc}`)
    let data = await res.json()
    loading_div.style.opacity = '0%'    // Turn off loading notification

    let dropdown = document.getElementById('dropdown')
    while (dropdown.firstChild) { dropdown.removeChild(dropdown.firstChild) }  // Remove any previous suggestions
    
    if (Object.keys(data).length === 0) {   // No suggestions found
        toggle_alert('No suggestions found for this UPC. Please enter a name.')
        return
    }
    
    let sugg_arr = Array.from(data)
    let product_name = document.getElementById('product-name')
    sugg_arr.sort((a, b) => { return a.length - b.length})  // Sort by length (ascending) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    sugg_arr.forEach(suggestion => {
        // https://www.javascripttutorial.net/dom/manipulating/create-a-dom-element/
        const div = document.createElement('div')
        const span = document.createElement('span')
        span.className = 'ms-1'
        span.textContent = suggestion
        div.className = 'noselect'

        div.addEventListener('click', e => { 
            product_name.value = e.target.textContent   // Set the selected name to be the input
            dropdown.style.visibility = 'hidden' // Make dropdown invisible
        })   

        div.appendChild(span)
        dropdown.appendChild(div)
    })

    dropdown.style.visibility = 'visible' // Make dropdown visible
}

let toggle_dropdown = e => {
    let flag = (e.target.id === 'product-name') ? true : false  // flag tells us if the product name form box was clicked
    let dropdown = document.getElementById('dropdown')
    if (flag && dropdown.children.length) { dropdown.style.visibility = 'visible'} // Only show dropdown if we have things to show
    if (!flag && dropdown.style.visibility === 'visible') { dropdown.style.visibility = 'hidden'} // Hide dropdown if nothing to show
}

Quagga.onProcessed((data) => {
    if (data === undefined || data.codeResult === undefined) return
    let upc_tag = document.getElementsByName('product-upc')[0]
    upc_tag.value = data.codeResult.code
    stop_media()
    fetch_name_suggestion(data.codeResult.code)
})

