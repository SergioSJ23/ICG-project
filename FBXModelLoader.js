// FBXModelLoader.js

import { FBXLoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/FBXLoader.js';

export function loadFBXModel(scene, modelPath, position = { x: 0, y: 0, z: 0 }, scale = 1) {
    const loader = new FBXLoader();
    loader.load(modelPath, function(object) {
        object.position.set(position.x, position.y, position.z);
        object.scale.set(scale, scale, scale);
        scene.add(object);
    }, undefined, function(error) {
        console.error('An error happened while loading the model:', error);
    });
}
