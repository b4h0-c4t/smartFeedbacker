// ==UserScript==
// @name        Smart Feedbacker
// @namespace   https://takachan-mirai.github.io
// @description 受けていない講義のフィードバックを非表示にする
// @include     /http:\/\/onlinefeedback\.fun\.ac\.jp\/assessment\/[0-9]{4}-[0-9]{1}\/?/
// @version     1.0.0
// @grant       none
// ==/UserScript==

(() => {
  document.body.innerHTML = `
    <div>
      <div>
        <span>Grade</span>
        <input id="grade" type="text" />
      </div>
      <div>
        <span>Class</span>
        <input id="class" type="text" />
      </div>
      <input id="submit" type="submit" value="submit" />
    </div>
  ` + document.body.innerHTML;

  const storageItem = localStorage.getItem('smartFeedBacker_config');
  const config = (storageItem !== null && storageItem !== undefined ? JSON.parse(storageItem) : []);

  document.querySelector('#grade').value = config !== [] ? config.grade : '';
  document.querySelector('#class').value = config !== [] ? config.alpha : '';

  document.querySelector('#submit').addEventListener('click', () => {
    //console.log(document.querySelector('#grade').value);
    //console.log(document.querySelector('#class').value);
    localStorage.setItem('smartFeedBacker_config', JSON.stringify({
      grade: document.querySelector('#grade').value,
      alpha: document.querySelector('#class').value
    }));
    location.reload();
  });
})();

(() => {
  const storageItem = localStorage.getItem('smartFeedBacker_config');
  const config = (storageItem !== null && storageItem !== undefined ? JSON.parse(storageItem) : []);

  const tr = document.querySelectorAll('tr');
  const records = [].map.call(tr, obj => obj);

  const grade = config.grade !== [] ? new RegExp(config.grade) : new RegExp('');
  const alpha = config.alpha !== [] ? new RegExp(config.alpha) : new RegExp('');

  const needRecords = records.filter(obj => {
    const classes = obj.childNodes[4].innerText;
    return (
      classes === '対象クラス'
      || classes === '1～4'
      || (grade.test(classes) && alpha.test(classes))
    );
  });

  const tb = document.querySelector('tbody');
  tb.innerHTML = '';
  needRecords.forEach(obj => tb.append(obj));
})();
