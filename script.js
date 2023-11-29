const ALTURA_JOGO = 600;
const LARGURA_JOGO = 600;
let fim = false;
let iniciou = false;
let TAMANHO_NAVE = 64;


const musica = new Audio();
musica.src = 'sounds/music.mp3';
musica.preload = 'auto';

const gameOver = new Audio();
gameOver.src = 'sounds/fimDeJogo.wav';
gameOver.preload = 'auto';
    

const teclado = {
    esquerda: false,
    direita: false, 
    cima: false, 
    baixo: false, 
    espaco: false,
    limite: false,
    iniciou: false
}

class Sprite {
    constructor(x, y, largura, altura, imagem, inimigo){
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.imagem = imagem;
        this.velocidade = 5;  
        this.inimigo = inimigo; 

    }

    

    desenhar(ctx) {
        if(this.inimigo == false) {
           
            ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura); 

          
        }else if(this.inimigo == true ) {
           
            ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura); 


        }else{
           
            // ctx.fillStyle = "green";
            // ctx.fillRect(this.x, this.y, this.largura, this.altura);

            ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura); 

          

           
        }
        
        
    }

    get centro() {
        return {
            x: this.x + this.largura/2,
            y: this.y + this.altura/2
        };
    }

    // Verifica se this (Este sprite) acertou outra sprite
    colideCom(outraSprite) {
        // Encontra o valor absoluto do centro
        let a = Math.abs(outraSprite.centro.x - this.centro.x);
        let b = Math.abs(outraSprite.centro.y - this.centro.y);

        // Calcula a distância
        let d = Math.sqrt(a**2 + b**2);

        // Calcula o raio
        let r1 = this.largura/2;
        let r2 = outraSprite.altura/2;

        return d <= r1 + r2;
    }
    
}



class Meteoro extends Sprite{
    constructor () {
        
        let img = new Image();
        img.src = 'imgs/meteoro.png';


        super(Math.random() * (LARGURA_JOGO - 30), -80 , 60, 60, img, true);
        
        this.velocidadeX = 2 * Math.ceil(Math.random()) + 2;

        // super(LARGURA_JOGO,  Math.random() * (ALTURA_JOGO - 30), 30, 30);
        // this.velocidadeX = -2 * Math.random() - 1;

       
    }


    atualizar() {
        this.y += this.velocidadeX;

        if(this.y + this.altura > ALTURA_JOGO + 60) {
            this.y = -40;
            this.x = Math.random() * (LARGURA_JOGO - 30);
            
        }

        // this.x += this.velocidadeX;

        // if(this.x + this.largura < 0) {
        //     this.x = LARGURA_JOGO;
        //     this.y = Math.random() * (ALTURA_JOGO - 30);
            
        // }
        
    }

    destruir() {
        this.y = ALTURA_JOGO;
        this.x = Math.random() * (LARGURA_JOGO - 30);

        // this.x = LARGURA_JOGO;
        // this.y = Math.random() * (ALTURA_JOGO - 30);
        const destruicao = new Audio();
        destruicao.src = 'sounds/destruicao.wav';
        destruicao.preload = 'auto';
        destruicao.volume = 0.09;
        destruicao.play();

    }
}
class Tiro extends Sprite {
    constructor() {
        let img = new Image();
        img.src = 'imgs/tiro.png';
        super(nave.centro.x - 2, nave.centro.y - 30, 20, 20, img);
        this.velocidadeX = 15;
    }

    atualizar() {
        this.y -= this.velocidadeX;
        if (this.y > ALTURA_JOGO) {
            this.podeSerDestruido = true;
        }

        
        // this.x += this.velocidadeX;
        // if (this.x > LARGURA_JOGO) {
        //     this.podeSerDestruido = true;
        // }
    }
}

let canvasEl = document.querySelector('#jogo');
let ctx = canvasEl.getContext('2d');

ctx.imageSmoothingEnabled = false;

let imagemNave = new Image();
imagemNave.src = 'imgs/nave3.png';

let nave = new Sprite((LARGURA_JOGO / 2) - TAMANHO_NAVE, ALTURA_JOGO - TAMANHO_NAVE, TAMANHO_NAVE, TAMANHO_NAVE, imagemNave, 1 );

let meteoros = [];
meteoros.push(new Meteoro());
meteoros.push(new Meteoro());
meteoros.push(new Meteoro());
meteoros.push(new Meteoro());
let tiros = [];

//pontuação
let pontos = 0;

//Vidas
let vidas = 3;

imagemNave.addEventListener('load', () =>{
    desenhaJogo();
 
});



// Movimentação do personagem de acordo com o pressionamento da tecla
document.addEventListener("keydown", evento =>{
    let tecla = evento.keyCode;
   
      //esquerda
    if(tecla === 65){
        teclado.esquerda = true;

        //baixo
    }else if(tecla === 83){
        teclado.baixo = true;

        //direita
    }else if(tecla === 68){
        teclado.direita = true;

        //cima
    }else if(tecla === 87){
        teclado.cima = true;
        
    }
});

document.addEventListener("keyup", evento =>{
    let tecla = evento.keyCode;
   
    if(tecla === 65){
        //esquerda
        teclado.esquerda = false;
        //baixo
    }else if(tecla === 83){
        teclado.baixo = false;
        //direita
    }else if(tecla === 68){
        
        teclado.direita = false;
        //cima
    }else if(tecla === 87){

        teclado.cima = false;
        
    }
});


function movimento () {
    if(teclado.esquerda){
        if((nave.centro.x - ((nave.largura/2)- 10)) > 0 ) {
            nave.x -= nave.velocidade;
                    
        }
    }if(teclado.baixo){
        if((nave.centro.y + ((nave.largura/2)- 10)) < ALTURA_JOGO) {
            nave.y += nave.velocidade;
        }
    }if(teclado.direita){
        if((nave.centro.x + ((nave.largura/2)- 10)) < LARGURA_JOGO) {
            nave.x += nave.velocidade;
        }
    }if(teclado.cima){
        if((nave.centro.y - ((nave.largura/2)- 10)) > 0) {
            nave.y -= nave.velocidade;
        }
    }
   
    requestAnimationFrame(movimento);
  
    
}
requestAnimationFrame(movimento);

//Adiciona pontos
function adicionaPonto(){
    // ctx.fillText("Pontuação: ", 160, 50);
    // ctx.fillText(pontos, 350, 50);
    // ctx.fillStyle = "red";
    // ctx.font = "22px Space ";

    document.getElementById('pontos').innerHTML = "Pontuação: <br>" + pontos;

}

//Adiciona vida
function adicionaVida(){
    // ctx.fillText("Vidas: ", 20, 50);
    // ctx.fillText(vidas, 120, 50);
    // ctx.fillStyle = "darkgreen";
    // ctx.font = "22px Space";

    document.getElementById('vidas').innerHTML = "Vidas: <br>" + vidas;
}

// 1. Apaga tudo, 2. desenha nave, 3. meteoros
function desenhaJogo() {
    if(fim){

        fimJogo();
    }

    if(teclado.iniciou){
        inicia();
        
    }

    ctx.clearRect(0, 0, LARGURA_JOGO, ALTURA_JOGO );
    nave.desenhar(ctx);
    adicionaPonto();
    adicionaVida();
    
    for (let meteoro of meteoros) {
        meteoro.desenhar(ctx);
    }

    for (let tiro of tiros) {
        tiro.desenhar(ctx);
    }
    
   
    
}


function atualizaInimigos() {
     // Atualiza a posição dos meteoros
     for (let meteoro of meteoros) {
        meteoro.atualizar();
        
    }
}

function atualizaTiros() {
       // Atualiza posição dos tiros
       for (let tiro of tiros) {
        tiro.atualizar();
    }

    for (let i = 0; i < tiros.length; i++) {
        if(tiros[i].podeSerDestruido) {
            tiros.splice(i, 1);
        }
    }

}

function verificaColisoes() {
    
    // Verifica se algum meteoro atingiu jogador
    for(let meteoro of meteoros) {
        const atingiunave = meteoro.colideCom(nave);

       if(atingiunave) {
            meteoro.destruir();
            teclado.baixo = false;
            teclado.cima = false;
            teclado.esquerda = false;
            teclado.direita = false;
            if(vidas <= 3 && vidas > 0){
                vidas--;
            }else{
                pontos = 0;
                vidas = 3;

                //Faz o jogo parar
                clearInterval(interval);
                fim = true;
                musica.pause();
                gameOver.play();
                

               
            }  
       }
    }
    // Verifica colisões de tiros e meteoros
    for (let meteoro of meteoros) {
        for (let tiro of tiros) {
            const tiroAtingiuMeteoro = tiro.colideCom(meteoro);
            
            //Verifica se atingiu o meteoro
            if(tiroAtingiuMeteoro) {
                tiro.podeSerDestruido = true;
                meteoro.destruir();

                //Adiciona pontos na tela
                pontos++;
                document.getElementById("pontuacao").innerHTML = "Pontuação: " + pontos;

                if(meteoros.length == 12){
                    meteoros.splice(0, 2)
                }
                // Adiciona inimigo
                if(pontos == 30){
     
                    meteoros.push(new Meteoro());
                    meteoros.push(new Meteoro());

                    
                }else if(pontos == 40){
     
                    meteoros.push(new Meteoro());

                }else if(pontos == 80){
                    
                    meteoros.push(new Meteoro());

                }

               
                
            }
        }
    }

    

}

function atualizaLogicaJogo () {
    if(teclado.iniciou){
    musica.play()
    atualizaInimigos();
    atualizaTiros();
    verificaColisoes();

    
    // Redesenha o Jogo
    desenhaJogo();
    }
}

//velocidade dos spawns
const interval = setInterval(atualizaLogicaJogo, 33); 
     
function darTiro () {
    let tiro = new Tiro(nave);
    tiros.push(tiro);
    const fire = new Audio();
    fire.src = 'sounds/tiro.wav';
    fire.preload = 'auto';
    fire.volume = 0.09;
    fire.play();
};

document.body.addEventListener('keydown', e => {
  let tecla = e.key;

    if(tecla == " ") {
        e.preventDefault();
        teclado.espaco = true;
    }
});

document.body.addEventListener('keyup', e => {
    let tecla = e.key;
      if(tecla == " ") {
          e.preventDefault();
          teclado.espaco = false;
      }
  });

function fogo () {
    if(teclado.espaco){
        darTiro();    
    }   
}

//Velocidade dos disparos
setInterval(fogo, 100);

function fimJogo(){
    let aparecer = document.getElementById('gameOver').style.display;
    

        if(aparecer == "block") {
            document.getElementById('gameOver').style.display = 'none';
            document.getElementById('jogo').style.display = "block";
            
            
        }else {
            document.getElementById('gameOver').style.display = 'block';
            
            
            
        }
        
}


const botao = document.getElementById('botao-reiniciar');
botao.addEventListener('click', (event)=>{
    event.target.classList.toggle('ativado' )
    
    const iniciar = new Audio();
    iniciar.src = "sounds/iniciar.wav";
    iniciar.preload = 'auto';
    iniciar.play();

    botao.innerHTML = "Aguarde";
    document.getElementById('gameInicio').style.display = 'none';
    setTimeout(()=>{
        document.location.reload();
        
    },1000);
    document.getElementById('gameInicio').style.display = 'none';
    

})

 


const botaoInicia = document.getElementById('botao-iniciar');

botaoInicia.addEventListener("click", (event)=>{
   
    event.target.classList.toggle("ativado");

    const iniciar = new Audio();
    iniciar.src = "sounds/iniciar2.wav";
    iniciar.preload = 'auto';
    iniciar.play();

    
    inicia();
    teclado.iniciou = true;
    
})


function inicia(){

    const aparecer = document.getElementById('gameInicio').style.display ;
    
        if(aparecer === "block") {
           
            document.getElementById('gameInicio').style.display = 'block';
            document.getElementById('jogo').style.display = "none";
            
            
        }else {
            document.getElementById('gameInicio').style.display = 'none';
           
        }
}




