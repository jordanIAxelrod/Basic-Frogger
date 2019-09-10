(function() {
  const Dequeue = function(list=[]) {

    this.entries = list;
    this.currIndex = 0;
    this.tempIndex = this.currIndex;
  }
  Dequeue.prototype.getList = function() {
    let resultList = [];
    if (this.entries.length >= 3) {
      for (i = 0; i < 3; i++) {
        resultList.push(this.entries[this.tempIndex]);
        this._next();
      }
      this.restoreTemp();
    }
    return resultList;
  }

  Dequeue.prototype.previous = function() {
    this.currIndex -= 1;
    if (this.currIndex < 0) {
      this.currIndex = this.entries.length - 1;
    }
    this.tempIndex = this.currIndex;
  }

  Dequeue.prototype.next = function() {
    this.currIndex += 1;
    if (this.currIndex === this.entries.length) {
      this.currIndex = 0;
    }
    this.tempIndex = this.currIndex;
    return this.entries[this.currIndex]
  }
  Dequeue.prototype._next = function() {
    this.tempIndex += 1
    if (this.tempIndex === this.entries.length) {
      this.tempIndex = 0;
    }
  }
  Dequeue.prototype.restoreTemp = function() {
    this.tempIndex = this.currIndex;
  }

  Dequeue.prototype.append = function(entry) {
    this.list.push(entry);
  }
  window.Queue = {Dequeue: Dequeue};

})()
