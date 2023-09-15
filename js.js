getCourt();
//Tar från local storage samt renderar in dom
let persons = JSON.parse(localStorage.getItem("persons")) || {};
for(let p in persons){
    renderOne(persons[p]);
}

//Savar
persistToLocaleStorage();
//Hämtar json

//Savar
function persistToLocaleStorage(){
    localStorage.setItem("persons", JSON.stringify(persons));
}
//Skapar form samt gör en eventlistener till förstaknappen/enter
const form =  document.querySelector('form');
form.addEventListener('submit', handleSubmit)
//Skapar en spelare
function handleSubmit(e){
    //Preventar att saken fuckar
    e.preventDefault();
    //Checkar så att man har gett den ett namn (Man kan dock fortfarande ge samma namn som något som redan finns)
  if(document.querySelector("#namnBox").value!='' && DoesPlayerExist(e.target.name.value)==false){
//Ett objekt med namn typning
    persons[e.target.name.value] = {
        //Namnet(finns säkert nåt sätt att få fram det på bättre men jag har det som en grej iaf)
        name:e.target.name.value,
        //Total score
        score: 0
    };
    console.log(persons);


    //Lägg till array till Locale Storage
    persistToLocaleStorage();
    //Renderar namnet
    renderOne(persons[e.target.name.value]);
    if(document.querySelector(".mainDiv")==undefined){renderCourt()}
//Emptyar boxen
    e.target.name.value = "";
}
else{
    //Händer ifall man inte skrev i boxen
    console.log("Skriv i saken!");
}
}

function DoesPlayerExist(playerName){
    for(let p in persons){
        if(p==playerName){
            return true;
        }
    }
return false;
}
//Renderar ett namn
function renderOne(person){
    
    //Skapar en div samt header2
    let div = document.createElement("div");
    let h2 = document.createElement("h2");
    h2.addEventListener("click",removePlayer);
    h2.className=person.name+"-person";
    h2.id=person.name;
    // lägger id på diven

    div.id = person.name+"-person";
    //console.log(div.id);
    //Lägger till texten till den
    h2.innerText = person.name+" ";
    //Slänger in h2 på diven
    div.appendChild(h2);
    //Slänger på diven på en div med klassen namnes
    document.querySelector(".names").appendChild(div);
    updateScoreBoard();

}
function removePlayer(e){
    let div=document.getElementById(e.target.className);
    div.remove();

    console.log(e.target.classList);
    delete persons[e.target.id];
    console.log(persons);
    persistToLocaleStorage();
    updateScoreBoard();
    if(Object.keys(persons).length==0){
        if(document.querySelector(".mainDiv")!=undefined){
            document.querySelector(".mainDiv").remove();
        }
        if(document.querySelector(".ResultatsDiv")!=undefined){
            document.querySelector(".ResultatsDiv").remove();
        }
    }
    
}

//Funktionen kollar i json filen och hämtar ut sakerna
async function getCourt(){
let response =await fetch("info.json");
court=await response.json();
console.log(court);
renderCourt();
}

//Renderar alla courtsen
function renderCourt(){
    //Checkar så att man faktiskt redan har en spelare
    if(Object.keys(persons).length!=0){
        if(document.querySelector(".mainDiv")!=undefined){
            document.querySelector(".mainDiv").remove();
        }

    let mainDiv=document.createElement("div");
    mainDiv.className="mainDiv";
    //For each court
    //Vette ifall court.court behövs
    court.court.forEach((c)=>{
        //console.log("hål", c);

        //Skapar en div samt bantext och sen lägger till det på diven
        let div=document.createElement("div");
        div.classList="holeInputDiv";
        div.id=c.id;


        let bantext=document.createElement("h4");
        bantext.innerText=(c.id+": "+c.info+" (Par är "+c.par+")")
        let div2=document.createElement("div");
        div2.appendChild(bantext);
        div2.className="container2";
        div.appendChild(div2);


        //För varje person lägger till namnet samt en textruta
        for(let p in persons){

           console.log(persons[p]);
           //Gör en text där det stog "Person fick:" samt poängen
           let text=document.createElement("p");
           text.innerText=(p+" fick:");
           //Gör en input ruta där man lägger på poängen
           let i =document.createElement("input");
           //Ger namnet på spelaren på den
           i.name=p;
           //Vet inte helt hur dataset fungerar
           i.dataset.id=c.id;
           //Gör den till typen nummer
           i.type="number";
           //Ger den startvärdet 0
           i.value=0;
           //Ifall det redan finns data så slängs den in
           if(persons[p][c.id]!=null&&persons[p][c.id]!=undefined){
           i.value=parseInt(persons[p][c.id]);
           }
         
           //Console loggar personens poäng
           console.log(parseInt(persons[p][c.id]));
           //eventlistener som sparar personens score ifall rutan ändras
           i.addEventListener("input",saveScore);
           //Consol loggar vad den har för värde
           console.log((i.value));
           
text.appendChild(i);
           //Slänger ut texten och input saken på skärmen
           div.appendChild(text);
        }
        //Slänger på hela course saken på skärmen
        mainDiv.appendChild(div);
        if(document.querySelector(".ResultatsDiv")!=undefined){
            document.querySelector(".ResultatsDiv").remove();
            
        }
        färdig();
    });
    document.querySelector(".courses").appendChild(mainDiv);


    /* //Skapar en redo knapp
    let knapp =document.createElement("input");
    //Lägger typen button
    knapp.type="button";
    //Lägger texten färdig
    knapp.value="Färdig";
    //Lägger till en eventlistenr som leder till resultat saken
    knapp.addEventListener("click",färdig);
    //Slänger ut knappen på skärmen
    document.querySelector(".mainDiv").appendChild(knapp); */


    //Loggar personer
    console.log(persons);
}}
//Savear en persons score
function saveScore(e){
console.log(e.target);



    let result = parseInt(e.target.value);
    if(e.target.value==""){result=0;}
    let name = e.target.name;
	let holeId = e.target.dataset.id;

    if(persons[name][holeId]==undefined){persons[name][holeId]=0}
    console.log(persons[name][holeId]+" "+result)
	console.log(name, holeId, result);

    persons[name].score-=parseInt(persons[name][holeId]);

    
    persons[name][holeId]=result;
    persons[name].score+=result;
    console.log(name+" namn har scoret "+persons[name].score);

persistToLocaleStorage();
	console.log(persons);
    if(document.querySelector(".ResultatsDiv")!=undefined){
        document.querySelector(".ResultatsDiv").remove();
        färdig();
    }
}
//Räknar ihop scoresen och sen slänger upp den på skärmen(inte i storleksordning dock)
function färdig(){
  if(document.querySelector(".ResultatsDiv")!=undefined){
    document.querySelector(".ResultatsDiv").remove();
  }
  //Skapar en div
  let div= document.createElement("div");
  div.className="ResultatsDiv";
  let pMin; 
  let PminNamn;
  //Går igenom varenda person
  let Keys=Object.keys(persons);
  //console.log(Keys);
  Keys.sort((a,b)=>persons[a]["score"]-persons[b]["score"]);
  //console.log(Keys);

  Keys.forEach((p)=>
  {
    //Skapar ett h2 element och lägger till texten på hur många poäng personen fick
    let h2 = document.createElement("h2");
    h2.innerText+=((Keys.indexOf(p)+1)+". "+p+" Fick: "+persons[p].score);

    //Slänger på texten på diven
    div.appendChild(h2);
    //Slänger på diven på skärmen
    let results=document.querySelector(".results");
    results.appendChild(div);


    if(pMin>persons[p].score||pMin==undefined){ pMin=persons[p].score; PminNamn=p}
        
    else if(pMin==persons[p].score){PminNamn+=(" och "+p)}
    console.log("Pmin="+pMin+" p="+persons[p].score);

  });
  let h2 = document.createElement("h2");
  h2.innerText+=(PminNamn+" vann!");

  //Slänger på texten på diven
  div.appendChild(h2);
  //Slänger på diven på skärmen
  let results=document.querySelector(".results");
  results.appendChild(div);
}


function updateScoreBoard(){
    if(document.querySelector(".mainDiv")!=undefined){
        document.querySelector(".mainDiv").remove();
        renderCourt();
    }
    if(document.querySelector(".ResultatsDiv")!=undefined){
        document.querySelector(".ResultatsDiv").remove();
        färdig();
    }
}