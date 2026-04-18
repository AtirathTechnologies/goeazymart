import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Hero = () => {
  const canvasRef = useRef(null);
  const globeContainerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !globeContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true, 
      antialias: true 
    });

    // Better resize handler
    const handleResize = () => {
      if (!globeContainerRef.current) return;
      
      const width = globeContainerRef.current.clientWidth;
      const height = globeContainerRef.current.clientHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(globeContainerRef.current);

    // Initial call
    setTimeout(handleResize, 150);

    // Globe Setup
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg");
    
    const material = new THREE.MeshStandardMaterial({ 
      map: texture,
      roughness: 0.5,
      metalness: 0.1,
    });

    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Airplanes
    const airplanes = [];
    for (let i = 0; i < 5; i++) {
      const planeTexture = textureLoader.load("https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Airplane_silhouette.png/512px-Airplane_silhouette.png");
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: planeTexture, 
        transparent: true, 
        depthTest: false,
        opacity: 0.85 
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(0.35, 0.35, 1);
      scene.add(sprite);

      airplanes.push({
        mesh: sprite,
        angle: Math.random() * Math.PI * 2,
        radius: 1.5 + Math.random() * 0.4,
        speed: 0.0018 + Math.random() * 0.0022
      });
    }

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.3);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      
      globe.rotation.y += 0.0018;

      airplanes.forEach(p => {
        p.angle += p.speed;
        p.mesh.position.x = p.radius * Math.cos(p.angle);
        p.mesh.position.z = p.radius * Math.sin(p.angle);
        p.mesh.position.y = Math.sin(p.angle * 2.5) * 0.25;
        p.mesh.material.rotation = -p.angle;
      });

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className="hero py-5 py-md-0"
      style={{
        minHeight: '92vh',
        background: 'linear-gradient(135deg, #fffdf8, #faf6ee)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(200, 151, 43, 0.08) 0%, transparent 60%)'
      }}></div>

      <div className="container h-100">
        <div className="row align-items-center h-100 g-4 g-lg-5">

          {/* Left Content */}
          <div className="col-lg-7 col-md-12">
            <div className="pt-4 pt-lg-5">
              <div 
                className="d-inline-flex align-items-center gap-2 px-4 py-2 mb-4 rounded-pill"
                style={{
                  background: 'rgba(200, 151, 43, 0.12)',
                  border: '1px solid rgba(200, 151, 43, 0.3)',
                  color: 'var(--gold-light)',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                International Commodity Traders
              </div>

              <h1 
                className="display-1 fw-bold lh-1 mb-3"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(42px, 8vw, 82px)' }}
              >
                Global Trade,<br />
                <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Simplified.</span>
              </h1>

              <div className="mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(19px, 4vw, 28px)', letterSpacing: '5px', color: '#888' }}>
                Any Where &amp; Any Time
              </div>

              <p className="lead text-muted mb-5" style={{ maxWidth: '520px' }}>
                Goeasymart connects buyers and sellers across continents — delivering premium agricultural produce, food commodities, construction materials, textiles, and industrial goods with unmatched reliability.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <a 
                  href="#categories" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('categories'); }}
                  className="btn btn-lg px-5 py-3 fw-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                    color: '#111',
                    boxShadow: '0 10px 35px rgba(200, 151, 43, 0.4)'
                  }}
                >
                  Browse Products →
                </a>
                <a 
                  href="#contact" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                  className="btn btn-lg px-5 py-3 fw-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                    color: '#111',
                    boxShadow: '0 10px 35px rgba(200, 151, 43, 0.4)'
                  }}
                >
                  📩 Request Quote
                </a>
              </div>
            </div>
          </div>

          {/* Globe - Now visible on more screens */}
          <div className="col-lg-5 col-md-10 col-12 mx-md-auto">
            <div 
              ref={globeContainerRef}
              className="hero-globe mx-auto"
              style={{
                width: '100%',
                maxWidth: '480px',           // Reduced slightly for better mobile fit
                aspectRatio: '1 / 1',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))'
              }}
            >
              <canvas 
                ref={canvasRef} 
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Stats Section */}
      <div className="container mt-5 pt-4">
        <div className="row text-center g-4 border-top border-bottom py-4" style={{ borderColor: 'rgba(200, 151, 43, 0.25)' }}>
          <div className="col-6 col-md-3">
            <div className="display-4 fw-bold" style={{ color: 'var(--gold)' }}>150+</div>
            <small className="text-uppercase mt-2 d-block" style={{ letterSpacing: '1px', color: '#555' }}>Product Categories</small>
          </div>
          <div className="col-6 col-md-3">
            <div className="display-4 fw-bold" style={{ color: 'var(--gold)' }}>40+</div>
            <small className="text-uppercase mt-2 d-block" style={{ letterSpacing: '1px', color: '#555' }}>Countries Served</small>
          </div>
          <div className="col-6 col-md-3">
            <div className="display-4 fw-bold" style={{ color: 'var(--gold)' }}>10K+</div>
            <small className="text-uppercase mt-2 d-block" style={{ letterSpacing: '1px', color: '#555' }}>Successful Shipments</small>
          </div>
          <div className="col-6 col-md-3">
            <div className="display-4 fw-bold" style={{ color: 'var(--gold)' }}>24/7</div>
            <small className="text-uppercase mt-2 d-block" style={{ letterSpacing: '1px', color: '#555' }}>Trade Support</small>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;