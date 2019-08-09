import * as THREE from 'three';
import {vertexshader} from './MyPointShaders'
import {fragmentshader} from './MyPointShaders'
import * as sparkTex from '../../../assets/textures/spark1.png'

export class MyParticleSystem {
    constructor() {
        this.amount = 2000;
        this.radius = 20;

        this.positions = new Float32Array( this.amount * 3 );
        this.colors = new Float32Array( this.amount * 3 );
        this.sizes = new Float32Array( this.amount );
        this.vertex = new THREE.Vector3();
        this.color = new THREE.Color( 0xffffff );

        for ( var i = 0; i < this.amount; i ++ ) {
            this.vertex.x = ( Math.random() * 2 - 1 ) * this.radius;
            this.vertex.y = ( Math.random() * 2 - 1 ) * this.radius;
            this.vertex.z = ( Math.random() * 2 - 1 ) * this.radius;
            this.vertex.toArray( this.positions, i * 3 );
            if ( this.vertex.x < 0 ) {
                this.color.setHSL( 0.5 + 0.1 * ( i / this.amount ), 0.7, 0.5 );
            } else {
                this.color.setHSL( 0.0 + 0.1 * ( i / this.amount ), 0.9, 0.5 );
            }
            this.color.toArray( this.colors, i * 3 );
            this.sizes[ i ] = 10;
        }
        this.geometry = new THREE.BufferGeometry();
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
        this.geometry.addAttribute( 'customColor', new THREE.BufferAttribute( this.colors, 3 ) );
        this.geometry.addAttribute( 'size', new THREE.BufferAttribute( this.sizes, 1 ) );

        this.material = new THREE.ShaderMaterial( {
            uniforms: {
                color: { value: new THREE.Color( 0xffffff ) },
                pointTexture: { value: new THREE.TextureLoader().load(sparkTex) }
            },
            vertexShader: vertexshader,
            fragmentShader: fragmentshader,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        } );
        //
        this.mesh = new THREE.Points( this.geometry, this.material );
    }

    onAnimate (step) {
    }
}