$("#ssic_code").keyup(function () {
    var e = e || window.event;
    var keycode = e.which || e.keyCode;
    if (keycode !== 13 || (e.target || e.srcElement).value == '')
        return false;
    $("#btn_search_ssic").trigger('click');
})

$("#btn_search_ssic").click(function () {
    var ssic_code = $('#ssic_code').val();
    if (ssic_code === '') {
        $('#table-overflow').html('');
    } else {
        var html = '';
        html += '<style>';
        html += 'table {';
        html += 'font-family: arial, sans-serif;';
        html += 'border-collapse: collapse;';
        html += 'width: 100%;';
        html += '}';

        html += 'td,';
        html += 'th {';
        html += 'border: 1px solid #dee2e6;';
        html += 'text-align: left;';
        html += 'padding: 8px;';
        html += '}';

        html += 'tr:nth-child(even) {';
        html += 'background-color: rgba(0, 0, 0, .05);';
        html += '}';

        html += '.text-center {';
        html += 'text-align: center';
        html += '}';

        html += 'tbody {';
        html += 'display: block;';
        html += 'min-height: 100px;';
        html += 'max-height: 500px;';
        html += 'overflow: auto;';
        html += '}';

        html += 'thead,';
        html += 'tbody tr {';
        html += 'display: table;';
        html += 'width: 100%;';
        html += 'table-layout: fixed;';
        html += '}';

        html += 'thead {';
        html += 'width: calc(100%)';
        html += '}';

        html += 'table {';
        html += 'width: 100%;';
        html += '}';

        html += '.highlight {';
        html += 'background-color: #fdc202;';
        html += '}';
        html += '</style>'

        html += '<h3 id="result_text" class="heading-10" style=""></h3>';
        html += '<table>';
        html += '<thead>';
        html += '<tr style="background-color: #4dc7ba!important;color:#ffffff;">';
        html += '<th class="text-center" style="width: 200px;">SSIC ' + dataSSIC.year + '</th>';
        html += '<th class="text-center">INDUSTRY</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';

        var total = 0;
        var expression = new RegExp(ssic_code, "i");
        $.each(dataSSIC.results, function (key, value) {
            if (value.ssic.length === 5) {
                if (value.ssic.search(expression) != -1 || value.title.search(expression) != -1) {
                    var replaceD = "<span class='highlight'>" + ssic_code + "</span>";
                    var text_filter = new RegExp(ssic_code, "ig");

                    var ssic_highlight = value.ssic;
                    ssic_highlight = ssic_highlight.replace(text_filter, replaceD);

                    var title_highlight = value.title;
                    title_highlight = title_highlight.replace(text_filter, replaceD);

                    html += '<tr>';
                    html += '<td class="text-center" style="width: 200px;">' + ssic_highlight + '</td>';
                    html += '<td>' + title_highlight + '</td>';
                    html += '</tr>';
                    total = total + 1;
                }
            }
        });

        html += '</tbody>';
        html += '</table>';

        if (total > 0) {
            $('#table-overflow').html(html);
            $('#result_text').text('A total of ' + total + ' matches were found.');
        } else {
            $('#table-overflow').html('<h3 id="result_text" class="heading-10" style="">A total of 0 matches were found.</h3>');
        }
    }
});