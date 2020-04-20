//=============================================================================
// hh_Android_save.js
//=============================================================================

/*:
 * @plugindesc v1.0 Add Android local save support
               v1.0 添加Android本地存档支持
 * @author Hao
 *
 * @help
 *
 * The plugin fix RMMV save cannot be saved in local
 * 本插件添加了对Android 本地存档的支持,但必须与我的部署方案配合才能使用
 *部署方案:https://github.com/huhao1987/RMMV-android-deployment
 */


 //The mode is 0(isNwjs()) or 1(isMobileDevice)
 var mode=0
 StorageManager.isLocalMode = function() {
 if(Utils.isNwjs()||Utils.isMobileDevice()){
    if(Utils.isMobileDevice())
    mode=1;
  	return true;
 }
 };
 StorageManager.saveToLocalFile = function(savefileId, json) {
 if(mode==1){
   if(window.androidinterface){
    androidinterface.savedata(savefileId, json);
   }
   }
  else{
   var data = LZString.compressToBase64(json);
      var fs = require('fs');
      var dirPath = this.localFileDirectoryPath();
      var filePath = this.localFilePath(savefileId);
      if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
      }
      fs.writeFileSync(filePath, data);
      }
};

StorageManager.loadFromLocalFile = function(savefileId) {
if(mode==1){
    if(window.androidinterface){
    return androidinterface.loaddata(savefileId);
   }
    else return null;
    }
    else{
     var data = null;
        var fs = require('fs');
        var filePath = this.localFilePath(savefileId);
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath, { encoding: 'utf8' });
        }
        return LZString.decompressFromBase64(data);
    }
};

StorageManager.loadFromLocalBackupFile = function(savefileId) {
if(mode==1){
   if(window.androidinterface){
     return androidinterface.restorebackup(savefileId);
   }
   else return null;
   }
   else{
   var data = null;
       var fs = require('fs');
       var filePath = this.localFilePath(savefileId) + ".bak";
       if (fs.existsSync(filePath)) {
           data = fs.readFileSync(filePath, { encoding: 'utf8' });
       }
       return LZString.decompressFromBase64(data);
   }
};

StorageManager.localFileBackupExists = function(savefileId) {
if(mode==1){
      if(window.androidinterface){
     return androidinterface.backupexists(savefileId);
    }
	else return false;
	}
	else{
	  var fs = require('fs');
        return fs.existsSync(this.localFilePath(savefileId) + ".bak");
	}
};

StorageManager.localFileExists = function(savefileId) {
if(mode==1){
    if(window.androidinterface){
    return androidinterface.savefileexists(savefileId);
   }
   else return false;
   }
   else{
   var fs = require('fs');
       return fs.existsSync(this.localFilePath(savefileId));}
};

StorageManager.removeLocalFile = function(savefileId) {
    if (this.isLocalMode()) {
    if(mode==1){
       if(window.androidinterface){
    androidinterface.removefile(savefileId);
   }
   }
   else{
   var fs = require('fs');
       var filePath = this.localFilePath(savefileId);
       if (fs.existsSync(filePath)) {
           fs.unlinkSync(filePath);
       }
   }
 }
};

StorageManager.cleanBackup = function(savefileId) {
		if (this.isLocalMode()) {
		if(mode==1){
		if(window.androidinterface){
     androidinterface.cleanbackup(savefileId);
		}
		}
		else{
		var fs = require('fs');
                    var dirPath = this.localFileDirectoryPath();
                    var filePath = this.localFilePath(savefileId);
                    fs.unlinkSync(filePath + ".bak");
		}
		}	
		else {
			if (this.backupExists(savefileId)) {
		    var key = this.webStorageKey(savefileId);
			localStorage.removeItem(key + "bak");
			}
		}
	
};

StorageManager.restoreBackup = function(savefileId) {
        if (this.isLocalMode()) {
        if(mode==1){
             if(window.androidinterface){
     androidinterface.restorebackup(savefileId);
        }
        }
        else{
         var data = this.loadFromLocalBackupFile(savefileId);
                    var compressed = LZString.compressToBase64(data);
                    var fs = require('fs');
                    var dirPath = this.localFileDirectoryPath();
                    var filePath = this.localFilePath(savefileId);
                    if (!fs.existsSync(dirPath)) {
                        fs.mkdirSync(dirPath);
                    }
                    fs.writeFileSync(filePath, compressed);
                    fs.unlinkSync(filePath + ".bak");}
		}		
		else {
			 if (this.backupExists(savefileId)) {
            var data = this.loadFromWebStorageBackup(savefileId);
            var compressed = LZString.compressToBase64(data);
            var key = this.webStorageKey(savefileId);
            localStorage.setItem(key, compressed);
            localStorage.removeItem(key + "bak");
			 }
        }
   
};

StorageManager.backup = function(savefileId) {
    
        if (this.isLocalMode()) {
        if(mode==1){
         if(window.androidinterface){
      androidinterface.backupdata(savefileId);
    }
    }
    else{
     var data = this.loadFromLocalFile(savefileId);
                var compressed = LZString.compressToBase64(data);
                var fs = require('fs');
                var dirPath = this.localFileDirectoryPath();
                var filePath = this.localFilePath(savefileId) + ".bak";
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(filePath, compressed);}
        } 
		else {
			if (this.exists(savefileId)) {
            var data = this.loadFromWebStorage(savefileId);
            var compressed = LZString.compressToBase64(data);
            var key = this.webStorageKey(savefileId) + "bak";
            localStorage.setItem(key, compressed);
			}
        }

};