
const box = document.getElementById('box', 'box2');
    let leftPos = 50;
    let topPos = 50;
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          leftPos -= 50;
          break;
        case 'ArrowRight':
          leftPos += 50;
          break;
        case 'ArrowUp':
          topPos -= 50;
          break;
        case 'ArrowDown':
          topPos += 50;
          break;
        default:
          return;
      }
      box.style.left = leftPos + 'px';
      box.style.top = topPos + 'px';
      box2.style.left = leftPos + 'px';
      box2.style.top = topPos + 'px';
    });


