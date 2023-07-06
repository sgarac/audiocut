$(document).ready(function () {
    var audio = {
        close: function() {
            var a = document.getElementById('linkeditor_container'),
                b = document.getElementById('linkeditor_overlay');
            if (a) a.remove();
            if (b) b.remove();
        },
        init: function () {
            var array = ['audio/mpeg','audio/wav','audio/wav','audio/flac'];
            array.forEach(mine => {
            OCA.Files.fileActions.registerAction({
                name: 'cutAudio',
                displayName: 'RemoveBlank',
                mime: mine,
                permissions: OC.PERMISSION_UPDATE,
                type: OCA.Files.FileActions.TYPE_DROPDOWN,
                iconClass: 'icon-external',
                actionHandler: function (filename, context) {
                    var a = context.$file[0].children[1].children[0].children[0].innerHTML;
                    var b = 'background-repeat:no-repeat;margin-right:1px;display: block;width: 40px;height: 32px;white-space: nowrap;border-image-repeat: stretch;border-image-slice: initial;background-size: 32px;';
                    var position = 30;
                    var output = [a.slice(0, position), b, a.slice(position)].join('');
                    var self = this;
                    var finished = false;
                    /*document.getElementById("btnClose").addEventListener("click", function () {
                        audio.close();
                        finished = true;
                    });

                    document.getElementById("linkeditor_overlay").addEventListener("click", function () {
                        audio.close();
                        finished = true;
                    });*/
                    //document.getElementById(type).addEventListener("click", function ($element) {
                    var data = {
                        nameOfFile: filename,
                        directory: context.dir
                    };
                    var tr = context.fileList.findFileEl(filename);
                    context.fileList.showFileBusyState(tr, true);
                    $.ajax({
                        type: "POST",
                        async: "true",
                        url: OC.filePath('audiocut', 'ajax', 'convertHere.php'),
                        data: data,
                        success: function (element) {
                            element = element.replace(/null/g, '');
                            response = JSON.parse(element);
                            if (response.code == 1) {
                                this.filesClient = OC.Files.getClient();
                                audio.close();
                                context.fileList.reload();
                            } else {
                                context.fileList.showFileBusyState(tr, false);
                                audio.close();
                                OC.dialogs.alert(
                                    t('audiocut', response.desc),
                                    t('audiocut', 'Error' + filename)
                                );
                            }
                        }
                    });
                //});
            }
        });
    });
  }};
  audio.init();
});