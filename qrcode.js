'use strict';

$('#qr-code-button').on('click', function() {
    const writeQr = () => {
        const canvas = document.getElementById('qrcode');
        const text = document.getElementById('my-id').textContent;
        QRCode.toCanvas(canvas, text, {
            errorCorrectionLevel: 'H',
            mode: 'alphanumeric',
            scale: 8,
        }, (error) => {
            if (error) {
                console.log(error);
            }
        });
    };
    writeQr();

    $("#dialog").dialog({
        modal: true,
        buttons: {
            Ok: function() {
                $(this).dialog('close');
            }
        }
    });
});
