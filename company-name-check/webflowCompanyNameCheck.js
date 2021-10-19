$("#btn_search_cnc").click(function () {
    var company_name = $('#company_name').val();
    if (company_name === '') {
        $('#results_cnc').html('');
    } else {
        $('#results_cnc').html('<h3 id="result_text" class="heading-10" style="">Loading...</h3>');
        checkCompany(0);
    }
});
function checkCompany(offset = 0) {
    var query = JSON.stringify({ "entity_name": $('#company_name').val() })
    var url = 'https://data.gov.sg/api/action/datastore_search?resource_id=5ab68aac-91f6-4f39-9b21-698610bdf3f7&limit=100&offset=' + offset + '&q=' + query
    $total = 0;
    if (offset == 0) {
        $datalist = [];
        $isFetching = true;
    }
    $.get(url, function (data) {
        if ($isFetching) {
            if (data.result.records.length > 0 && offset < 901) {
                $datalist.push.apply($datalist, data.result.records)
                checkCompany(offset + 100)
            } else {
                $isFetching = false;
                createTable($datalist);
            }
        }
    });
}
function createTable(results) {
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

    html += '.text-danger {';
    html += 'color: red';
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

    html += '<h3 id="result_text" class="heading-10" style="">A total of ' + results.length + ' matches were found.</h3>';
    html += '<table>';
    html += '<thead>';
    html += '<tr style="background-color: #4dc7ba!important;color:#ffffff;">';
    html += '<th class="text-center" style="width: 150px;">UEN</th>';
    html += '<th>Name</th>';
    html += '<th class="text-center" style="width: 150px;">Type</th>';
    html += '<th class="text-center" style="width: 150px;">DATE OF ISSUE</th>';
    html += '<th class="text-center" style="width: 150px;">UEN STATUS</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    var status = '';
    var uen_status = '';
    var entityType = {
        "BN": "Business",
        "LP": "Limited Partnership",
        "FC": "Foreign Company",
        "LC": "Company",
        "LL": "Limited Liability Partnership",
        "PF": "Public Accounting Firm",
        "RF": "Representative Offices of Foreign ",
    }
    var entity_type = '';
    $.each(results, function (key, value) {
        // if (value.ssic.search(expression) != -1 || value.title.search(expression) != -1) {
        var text_filter = $('#company_name').val().toUpperCase();
        var replaceD = "<span class='highlight'>" + text_filter + "</span>";
        // var replaceD = "<span class='highlight'>" + $('#company_name').val().toUpperCase() + "</span>";
        // var text_filter = new RegExp($('#company_name').val(), "ig");
        var uen_highlight = value.uen.toUpperCase();
        uen_highlight = uen_highlight.replace(text_filter, replaceD);

        var entity_name_highlight = value.entity_name.toUpperCase();
        entity_name_highlight = entity_name_highlight.replace(text_filter, replaceD);
        if (value.uen_status === 'R') {
            uen_status = 'Registered';
            status = '';
        } else {
            uen_status = 'DeRegistered'
            status = 'text-danger';
        }
        if (entityType[value.entity_type]) {
            entity_type = entityType[value.entity_type]
        } else {
            entity_type = value.entity_type
        }

        var date = value.uen_issue_date;
        var dateAr = date.split('-');
        var uen_issue_date = dateAr[1] + '-' + dateAr[2] + '-' + dateAr[0];
        html += '<tr>';
        html += '<td class="text-center ' + status + '" style="width: 150px;">' + uen_highlight + '</td>';
        html += '<td class="' + status + '">' + entity_name_highlight + '</td>';
        html += '<td class="text-center ' + status + '" style="width: 150px;">' + entity_type + '</td>';
        html += '<td class="text-center ' + status + '" style="width: 150px;">' + uen_issue_date + '</td>';
        html += '<td class="text-center ' + status + '" style="width: 150px;">' + uen_status + '</td>';
        html += '</tr>';
    });
    html += '</tbody>';
    html += '</table>';

    if (results.length > 0) {
        $('#results_cnc').html(html);
    } else {
        $('#results_cnc').html('<h3 id="result_text" class="heading-10" style="">A total of 0 matches were found.</h3>');
    }
}