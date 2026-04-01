herelet mode="math";
let xp=0, level=1;

const app=document.getElementById("app");
const startBtn=document.getElementById("startBtn");
const input=document.getElementById("input");
const result=document.getElementById("result");
const canvasBox=document.getElementById("canvasBox");
const graphCanvas=document.getElementById("graphCanvas");

startBtn.onclick=()=>{
    document.getElementById("startScreen").style.display="none";
    app.style.display="block";
}

function setMode(m){
    mode=m;
    canvasBox.innerHTML="";
    result.innerText="";
}

function updateXP(){
    xp+=10;
    if(xp>=level*50){
        level++;
    }
    document.getElementById("xp").innerText=`XP: ${xp} | Level: ${level}`;
}

/* ================= AI CALCULATOR ================= */
function calculate(){
    let val=input.value.toLowerCase();

    try{

        // cube
        if(val.includes("cube")){
            let num=parseFloat(val.match(/\d+/));
            result.innerText=num*num*num;
            return;
        }

        // speed time
        if(val.includes("speed")){
            let nums=val.match(/\d+/g);
            result.innerText=nums[0]*nums[1];
            return;
        }

        // math
        val=val.replace(/×/g,"*").replace(/÷/g,"/");
        result.innerText=Function("return "+val)();

    }catch{
        result.innerText="Error";
    }
}

/* ================= GRAPH ================= */
function drawGraph(){
    let ctx=graphCanvas.getContext("2d");
    ctx.clearRect(0,0,400,250);

    for(let x=-10;x<10;x+=0.1){
        let y=eval(input.value.replace(/x/g,x));

        let px=(x+10)*20;
        let py=125-y*10;

        ctx.fillRect(px,py,2,2);
    }
}

graphCanvas.onclick=drawGraph;

/* ================= 3D ================= */
function setMode3D(){
    setMode("3d");

    let size=prompt("Enter size:");
    let s=parseFloat(size)||1;

    let scene=new THREE.Scene();
    let camera=new THREE.PerspectiveCamera(75,1,0.1,1000);
    let renderer=new THREE.WebGLRenderer();

    renderer.setSize(300,200);
    canvasBox.appendChild(renderer.domElement);

    let geo=new THREE.BoxGeometry(s,s,s);
    let mesh=new THREE.Mesh(geo,new THREE.MeshNormalMaterial());
    scene.add(mesh);

    camera.position.z=5;

    let mouseX=0, mouseY=0;

    renderer.domElement.onmousemove=(e)=>{
        mouseX=e.clientX/100;
        mouseY=e.clientY/100;
    }

    function animate(){
        requestAnimationFrame(animate);
        mesh.rotation.x+=0.01+mouseY;
        mesh.rotation.y+=0.01+mouseX;
        renderer.render(scene,camera);
    }
    animate();
}

/* ================= ATOMS ================= */
function setModeAtoms(){
    setMode("atoms");

    let canvas=document.createElement("canvas");
    canvas.width=300;
    canvas.height=200;
    canvasBox.appendChild(canvas);

    let ctx=canvas.getContext("2d");

    let atoms=[];
    for(let i=0;i<40;i++){
        atoms.push({x:Math.random()*300,y:Math.random()*200});
    }

    function animate(){
        ctx.clearRect(0,0,300,200);

        atoms.forEach(a=>{
            a.x+=Math.random()*4;
            a.y+=Math.random()*4;
            ctx.fillStyle="#00f0ff";
            ctx.fillRect(a.x,a.y,3,3);
        });

        requestAnimationFrame(animate);
    }
    animate();
}

/* ================= PUZZLE ================= */
function setModePuzzle(){
    setMode("puzzle");

    let a=Math.floor(Math.random()*10);
    let b=Math.floor(Math.random()*10);
    let ans=a+b;

    [ans,ans+1,ans-1,ans+2].forEach(o=>{
        let btn=document.createElement("button");
        btn.innerText=o;

        btn.onclick=()=>{
            if(o===ans){
                result.innerText="Correct";
                updateXP();
            }else{
                result.innerText="Wrong";
            }
        };

        canvasBox.appendChild(btn);
    });
}

/* ================= FIX BUTTONS ================= */
document.querySelectorAll(".topBtns button")[2].onclick=setMode3D;
document.querySelectorAll(".topBtns button")[3].onclick=setModeAtoms;
document.querySelectorAll(".topBtns button")[4].onclick=setModePuzzle;
