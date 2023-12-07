"use strict"

window.onload = function () {
    /**
     * Enabler
     */
    if (Enabler.isInitialized()) {
        init()
    } else {
        Enabler.addEventListener(studio.events.StudioEvent.INIT, init)
    }


    /**
     * Setting Dynamic Profile Id
     */
    function init() {
        if (Enabler.isPageLoaded()) {
            //Enabler.setProfileId(10867681)
            politeInit()
        } else {
            //Enabler.setProfileId(10867681)
            Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, politeInit)
        }
    }

    /**
     * Useful functions
    */

    async function politeInit() {
        const select = (s) => document.querySelector(s)
        const selectAll = (s) => document.querySelectorAll(s)

        const
            tl = gsap.timeline(),
            wrect = select('#wrect'),
            spxValue = select("#spxValue"),
            sectorData = select("#sectorData"),
            timestamp = select("#time"),
            head1 = select("#head1"),
            cta = select("#cta"),
            disclosureLink = select("#disclosureLink"),
            disclosure = select("#disclosure"),
            closeDisclosure = select("#closeDisclosure"),
            shine = select("#shine"),
            linkHere = select("#linkHere")

        let hereClicked = 0    


        /**
         * Exit 
         */

        const clickable = selectAll(".clickable")
        clickable.forEach(element => element.addEventListener("click", function (e) {
            if (!hereClicked) {
              Enabler.exit('Exit')
            } else {
                hereClicked = 0
            }
            return false
        }, false))


        disclosureLink.addEventListener("click", function (e) {
            disclosure.style.display = "block";
        }, false)

        closeDisclosure.addEventListener("click", function (e) {
            disclosure.style.display = "none";
        }, false)

        linkHere.addEventListener("click", function (e) {
            hereClicked = 1
        }, false)
        
        let imagesSrc = [{
            name: "close",
            src: "legal_close.png"
        },
        {
            name: "shine",
            src: "CTA_shine.png"
        }]

         const loadImages = async (srcsArr) => {
             const imagesArr = await Promise.all(srcsArr.map((img) => {
                 return new Promise((resolve) => {
                     const image = new Image()
 
                     image.nameImg = img.name
                     
                     image.onload = () => resolve(image)
                     image.src = img.src
                     img.image = image
                 })
             }))
 
             const images = imagesArr.reduce((acc, img) => {
                 acc[img.nameImg] = img
                 return acc
             }, {})
 
             return images
         }
 
         await loadImages(imagesSrc)

         //const link = "data.json" //we can set link to data
         const d = new Date()
         //const link = "https://storage.googleapis.com/barchart-market-public-data/ondemand-websol-barchart/data.json?timerandom1="+d.getTime()
         const link = "https://storage.googleapis.com/barchart-market-public-data/ondemand-websol-barchart/data.json"

         const response = await fetch(
             link,
             {
                 method: 'GET',
                 headers: {
                     'Accept': 'application/json',
                 }
             }
         )

         const data = await response.json()
         const sectors = []

         function compareH(a,b) {
            if (a.percentChange<b.percentChange) return 1; else return -1;
         }

         function two(s) {
            if (s.length == 4) return s.substr(2,2); else {
                if (s.length==1) return "0"+s; else return s;
            }
         }

         for (let i = 0;i<data.length;i++) {
            const res = data[i]
            // if (res.symbol === "SPY") {
            //     //S&P 500
            //     if (res.percentChange>0) {
            //         spxValue.classList.add("positive")
            //     }
            //     if (res.percentChange<0) {
            //         spxValue.classList.add("negative")
            //     }

            //     if (res.percentChange<0)
            //     spxValue.innerHTML = res.percentChange + "%";
            //     if (res.percentChange==0)
            //     spxValue.innerHTML = res.percentChange + "%"; else
            //     spxValue.innerHTML = "+"+res.percentChange + "%";

            //     //set time
            //     //2023-11-14T10:05:23-06:00
            //     const time = res.tradeTimestamp
            //     const dateTime = time.split("T")
            //     const datePart = dateTime[0]
            //     const timePart = dateTime[1]
            //     const etTime = timePart.substr(0,8)
            //     const etTimeEls = etTime.split(":")
            //     const dateEls = datePart.split("-")

            //     let hr = parseInt(etTimeEls[0],10)
            //     let timeS = ""

            //     if (hr>12) {
            //         hr-=12
            //         timeS = two(hr)+":"+etTimeEls[1]+" PM "
            //     } else timeS = two(hr)+":"+etTimeEls[1]+" AM "

            //     //10:14 AM ET 11/13/23
            //     timestamp.innerHTML = timeS+"ET "+two(dateEls[1])+"/"+two(dateEls[2])+"/"+two(dateEls[0])

            // } else {
                sectors.push(res)
            // }
         }
         console.log(sectors)


        //  sectors.sort(compareH)

        // reversed the loop
         for (let i = 11;i>=0;i--) {
             const el = document.createElement("div")
             el.setAttribute("id",sectors[i].symbol)
             el.classList.add("sectorBox")
             sectorData.appendChild(el)

             const symbol = document.createElement("span")
             const change = document.createElement("span")
            //  added the following for name 
             const name = document.createElement("span")

             el.appendChild(symbol)
             el.appendChild(change)
             el.appendChild(name)

             symbol.classList.add("symbol")
             symbol.innerHTML = sectors[i].symbol

             change.classList.add("change")

             const changeValue = document.createElement("span")

             change.appendChild(changeValue)

             if (sectors[i].percentChange==0){
                 changeValue.innerHTML = sectors[i].percentChange+"%";
                 changeValue.classList.add("nochange")    
             } else if (sectors[i].percentChange<0) {
                 changeValue.innerHTML = sectors[i].percentChange+"%"
                 changeValue.classList.add("negative")
             } else {
                changeValue.innerHTML = "+"+sectors[i].percentChange+"%"
                changeValue.classList.add("positive")
             } 
             
             name.classList.add("name")
             if (sectors[i].symbol == "SPY"){
                name.innerHTML = "S & P 500"
             } else if (sectors[i].symbol == "XLU"){
                name.innerHTML = "Utilities"
             } else if (sectors[i].symbol == "XLK"){
                name.innerHTML = "Technology"
             } else if (sectors[i].symbol == "XLRE"){
                name.innerHTML = "Real Estate"
             } else if (sectors[i].symbol == "XLB"){
                name.innerHTML = "Materials"
             } else if (sectors[i].symbol == "XLI"){
                name.innerHTML = "Industrials"
             } else if (sectors[i].symbol == "XLV"){
                name.innerHTML = "Health Care"
             } else if (sectors[i].symbol == "XLF"){
                name.innerHTML = "Financials"
             } else if (sectors[i].symbol == "XLE"){
                name.innerHTML = "Energy"
             } else if (sectors[i].symbol == "XLP"){
                name.innerHTML = "Consumer Staples"
             } else if (sectors[i].symbol == "XLY"){
                name.innerHTML = "Consumer Discretionary"
             } else if (sectors[i].symbol == "XLC"){
                name.innerHTML = "Communication"
             }else {
                name.innerHTML = ""
             }
             

             sectors[i].htmlEl = el
         }

            tl
              .to(wrect,{duration:.5,alpha:0,ease:"power2.in"},'.1')
              .to(frame1,{duration:.5,alpha:1,ease:"power1.out"},'+.5')
              .to(frame1,{duration:.5,alpha:0,ease:"power1.out"},'+4')

              .to(head1,{duration:.5,alpha:1,ease:"power1.out"},'+4.2')
              .to(head2,{duration:.5,alpha:1,ease:"power1.out"},'+4.6')

              .to(cta,{duration:.5,alpha:1,ease:"power1.out"},'+.5')
              .to(shine,{x:200,ease:"none",duration:.8},'-.3')

            //for (let i = 0;i<sectors.length;i++) {
                //if (!i)
                    //tl.from(sectors[i].htmlEl,{duration:1,y:50,ease:"power2"},'<'); else {
                       // tl.to(sectors[i-1].htmlEl,{duration:1,y:-50,ease:"power2"},'>1')
                        //tl.from(sectors[i].htmlEl,{duration:1,y:50,ease:"power2"},'<.1')
                    //}
            //}
   }
}
