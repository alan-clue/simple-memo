var memoList = [];
hljs.initHighlightingOnLoad();
//ローカルストレージ関係
var memoStorage = {
  get: function (memos) {
    memoList = JSON.parse(localStorage.getItem('simpleMemo') || '[]');
    return memoList;
  },
  save: function (memos) {
    memoList = memos;
    localStorage.setItem('simpleMemo', JSON.stringify(memoList));
  }
}

var memoVue = new Vue({
  el: '#note',
  data: {
    memos: memoStorage.get(),
    newMemo: '',
    selected: 0,
    viewMode : "compare"
  },
  watch: {
    memos: {
      handler: function (val) {
        memoStorage.save(val);
      },
      deep: true
    }
  },
  computed: {
    
    compiledMarkdown: function (memo) {
      var renderer = new marked.Renderer;
      renderer.code = function(code, language) {
        return '<pre'+'><code class="hljs language-'+ language +'">' + hljs.highlightAuto(code).value + '</code></pre>';
      };
      var view = marked(this.memos[this.selected]["body"], { 
        sanitize: true,
        breaks : true,
        highlight: function(code, lang) {
          return hljs.highlightAuto(code, [lang]).value;
        },
        renderer: renderer
      });
      return view;
       
    }
  },
  methods: {
  
    addMemo: function () {
      // if(!this.newMemo){
      //   return false;
      // }
      this.memos.push({
        title: "未設定",
        body: ""
      });
      //this.newMemo = '';
    },
    selectMemo: function (memo) {
      this.selected = memo;
    },
    editMemo: function (todo){
      this.editingMemo = todo;
      if (!this.editingMemo) {
        return
      }
      this.editingMemo = todo;
    },
    deleteMemo: function (memo){
      this.memos.splice(memo, 1);
    },
    changeMode: function (mode){
      this.viewMode = mode;
    },
    dataDownload: function (){
      handleDownload(this.memos[this.selected]);
    }
  }
});


document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.fixed-action-btn01');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'bottom'
  });
});
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.fixed-action-btn02');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'left'
  });
});
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var options = "";
  var instances = M.Modal.init(elems, options);
});


//document.getElementById('tab').addEventListener('keydown', function (e) {
$(".contents__edit textarea").on("keydown",function(e){
  if (e.keyCode === 9) {
    e.preventDefault();
    var elem = e.target;
    var val = elem.value;
    var pos = elem.selectionStart;
    elem.value = val.substr(0, pos) + '\t' + val.substr(pos, val.length);
    elem.setSelectionRange(pos + 1, pos + 1);
  }
});

function handleDownload(memo) {
  var title = memo.title;
  var content = memo.body;
  var blob = new Blob([ content ], { "type" : "text/plain" });

  if (window.navigator.msSaveBlob) { 
      window.navigator.msSaveBlob(blob, title + ".txt"); 
      window.navigator.msSaveOrOpenBlob(blob, title + ".txt"); 
  } else {
      document.getElementById("download").download = title + ".txt";
      document.getElementById("download").href = window.URL.createObjectURL(blob);
  }
}