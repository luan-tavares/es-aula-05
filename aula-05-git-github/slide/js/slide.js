(function(){
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var total = slides.length;

  function slideFromHash(){
    var n = parseInt(String(location.hash).replace('#', ''), 10);
    if(isNaN(n)) return 0;
    return Math.min(Math.max(n - 1, 0), total - 1);
  }

  var current = slideFromHash();

  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var fill = document.getElementById('progressFill');
  var counterCurrent = document.getElementById('counterCurrent');
  var counterTotal = document.getElementById('counterTotal');
  var eyebrowLabel = document.getElementById('eyebrowLabel');

  counterTotal.textContent = String(total).padStart(2, '0');

  function render(){
    slides.forEach(function(s, i){ s.hidden = (i !== current); });
    fill.style.width = ((current + 1) / total * 100) + '%';
    counterCurrent.textContent = String(current + 1).padStart(2, '0');
    eyebrowLabel.textContent = slides[current].dataset.eyebrow || '';
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
    history.replaceState(null, '', '#' + (current + 1));
  }

  function go(delta){
    var next = current + delta;
    if(next < 0 || next >= total) return;
    current = next;
    render();
  }

  prevBtn.addEventListener('click', function(){ go(-1); });
  nextBtn.addEventListener('click', function(){ go(1); });

  window.addEventListener('keydown', function(e){
    if(['ArrowRight','ArrowDown','PageDown',' '].indexOf(e.key) !== -1){
      e.preventDefault(); go(1);
    } else if(['ArrowLeft','ArrowUp','PageUp'].indexOf(e.key) !== -1){
      e.preventDefault(); go(-1);
    } else if(e.key === 'Home'){
      e.preventDefault(); current = 0; render();
    } else if(e.key === 'End'){
      e.preventDefault(); current = total - 1; render();
    }
  });

  render();
})();
