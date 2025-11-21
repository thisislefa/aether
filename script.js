document.addEventListener('DOMContentLoaded', function() {
    // Particle System
    const particleContainer = document.getElementById('defconParticles');
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    const particles = [];
    const connectors = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'defcon-particle';
      
      // Random position within container
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      
      // Random delay for pulse animation
      particle.style.animationDelay = `${Math.random() * 4}s`;
      
      particleContainer.appendChild(particle);
      particles.push({
        element: particle,
        x: posX,
        y: posY,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1
      });
    }
    
    // Create connectors
    for (let i = 0; i < particleCount * 2; i++) {
      const connector = document.createElement('div');
      connector.className = 'defcon-particle-connector';
      connector.style.opacity = '0';
      particleContainer.appendChild(connector);
      connectors.push(connector);
    }
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });
    
    // Animation loop
    function animateParticles() {
      const containerWidth = particleContainer.offsetWidth;
      const containerHeight = particleContainer.offsetHeight;
      
      particles.forEach((particle, index) => {
        // Apply slight movement
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Apply parallax effect based on mouse position
        particle.x += mouseX * 0.5;
        particle.y += mouseY * 0.5;
        
        // Boundary check
        if (particle.x < 0) {
          particle.x = 0;
          particle.vx *= -1;
        }
        if (particle.x > 100) {
          particle.x = 100;
          particle.vx *= -1;
        }
        if (particle.y < 0) {
          particle.y = 0;
          particle.vy *= -1;
        }
        if (particle.y > 100) {
          particle.y = 100;
          particle.vy *= -1;
        }
        
        // Update position
        particle.element.style.left = `${particle.x}%`;
        particle.element.style.top = `${particle.y}%`;
      });
      
      // Update connectors
      let connectorIndex = 0;
      for (let i = 0; i < particles.length && connectorIndex < connectors.length; i++) {
        for (let j = i + 1; j < particles.length && connectorIndex < connectors.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          // Calculate distance
          const dx = (p2.x - p1.x) * containerWidth / 100;
          const dy = (p2.y - p1.y) * containerHeight / 100;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only connect particles that are close enough
          if (distance < 150) {
            const connector = connectors[connectorIndex];
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            const left = p1.x;
            const top = p1.y;
            
            connector.style.width = `${distance}px`;
            connector.style.left = `${left}%`;
            connector.style.top = `${top}%`;
            connector.style.transform = `rotate(${angle}deg)`;
            connector.style.opacity = `${1 - distance / 150}`;
            
            connectorIndex++;
          }
        }
      }
      
      // Hide unused connectors
      for (let i = connectorIndex; i < connectors.length; i++) {
        connectors[i].style.opacity = '0';
      }
      
      requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Smooth scroll reveal
    const observerOptions = {
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('defcon-visible');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.defcon-headline, .defcon-subheadline, .defcon-cta-button').forEach(el => {
      observer.observe(el);
    });
    
    // CTA button hover effect
    const ctaButton = document.querySelector('.defcon-cta-button');
    
    ctaButton.addEventListener('mouseenter', () => {
      ctaButton.style.transform = 'translateY(-3px)';
    });
    
    ctaButton.addEventListener('mouseleave', () => {
      ctaButton.style.transform = 'translateY(0)';
    });
  });