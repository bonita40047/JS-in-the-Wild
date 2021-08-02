// To run this assignment, right click on index.html in the Visual Studio file explorer to the left
// and select "Open with Live Server"

// Your Code Here.
//Get location that we want to see photos of
 // 1. use Geolocation API to get coordinates (lat and lon) or use a fallback location
//	- [ this is a link to the documentation ]
 class GalaxyConFlickGallery {
    constructor(location) {
        this.term = 'galaxyCon'
        this.location = location
        this.container = document.getElementById('pictureContainer')
        this.page = 1
        this.perPage = 5
        this.currentPhotoIndex = 0
        this.photos = []
        this.isLoading = false
        this.isFirstLoad = true

        document.getElementById('pic').addEventListener('click', this.showNextPictures.bind(this))
    }
    startDisplayPictures() {
        setInterval(this.showNextPictures.bind(this), 2000)
    }

    showNextPictures() {
        if (this.isLoading) {
            return;
        }        
        console.log(" show the next pictures")
        this.currentPhotoIndex += 1

        let picObject = this.photos[this.currentPhotoIndex]
        this.showPicObject(picObject)

        if (this.currentPhotoIndex === this.photos.length - 2) {
            console.log("show another page of photos from Flickr")
            this.page += 1
            this.fetchDataFromFlickr()
        }
    }

    showPicObject(picObject) {
        let imageUrl = this.constructImageURL(picObject);
        let img = document.createElement('img')
        img.src = imageUrl
        this.container.append(img)
    }


    fetchDataFromFlickr() {
        let url = this.createApiUrl();
        console.log(url)
        let fetchPromise = fetch(url)
        this.loadingpic(true)
        fetchPromise
           .then(response => response.json())
            .then(parsedResponse => this.procedureFlickrResponse(parsedResponse))
    }

    procedureFlickrResponse(parsedResponse) {
        this.loadingpic(false)
        console.log(parsedResponse)
        this.photos = [this.photos, parsedResponse.photos.photo]
        if (this.photos.length > 0) {
            let firstPicture = this.photos[this.currentPhotoIndex]
            if (this.isFirstLoad) {
                this.showPicObject(firstPicture)
                this.isFirstLoad = false
            }
        
        }
    }
    loadingpic(isLoading) {
        let loadingPictures = document.getElementById('loading')
      if (isLoading) {
            this.isLoading = true
            loadingPictures.innerHTML = 'please wait for next picture to loading '
        } else {
            this.isLoading = false
           loadingSpan.innerHTML = ''
        }

    }

    createApiUrl() {
        return 'https://shrouded-mountain-15003.herokuapp.com/https://flickr.com/services/rest/' +
            '?api_key=77e6247a628e239fe4d19d511e7087e2' +
            '&format=json' +
            '&nojsoncallback=1' +
            '&method=flickr.photos.search' + 
            '&safe_search=1' +
            '&per_page=' + this.perPage +
            '&page=' + this.page +
            '&text=' + this.term +
            '&lat=' + this.location.latitude +
            '&lon=' + this.location.longitude;
    }
 }
    function constructImageURL (photoObj) {
        return "https://farm" + photoObj.farm +
                ".staticflickr.com/" + photoObj.server +
                "/" + photoObj.id + "_" + photoObj.secret + ".jpg";
    }

     
   

 function onGeolocationSuccess(data) {
    let location = data.coords;
    let photoGallery = new GalaxyConFlickGallery(location)
    photoGallery.fetchDataFromFlickr() 
    photoGallery.startDisplayPictures()
 }


    function onGeolocationError() {
        const fallbackLocation = { latitude: 38.0526563, longitude:-85.5509064} 
       let photoGallery = new GalaxyConFlickGallery(fallbackLocation)
        photoGallery.fetchDataFromFlickr() 
    }
  
navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError)

 function myCurrentGeolocation(){
  navigator.geolocation.getCurrentPosition(function(position){
      console.log(position.coords)
  })
 }

myCurrentGeolocation()

 function myCurrentPostion(){
    navigator.geolocation.watchPosition(function(position){
        console.log(position.coords)
    })
 }
myCurrentPostion()

