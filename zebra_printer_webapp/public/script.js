// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
let constraints = {
    video : {
        width : {max : 640},
        height : {max : 480}
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
                    readers : ['code_128_reader', 'ean_reader', 'upc_reader'],
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
    console.log(data)
})
