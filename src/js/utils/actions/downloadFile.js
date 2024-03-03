export function downloadFileNew(url, host, type = 'xlsx', name = { title: 'report', date: '' }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${host}/public/${type}/${url}`, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
      if (xhr.status === 200 || xhr.status === 201) {
        const blob = new Blob([xhr.response], { type: 'application/octet-stream' });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);

        let { title, date } = name;
        let finalName;

        if (title) {
          finalName = title.replace(/\s/g, '_');
        }
        if (date) {
          const inputDate = new Date(date);
          const options = { day: 'numeric', month: 'short', year: 'numeric' };
          date = inputDate.toLocaleDateString('en-US', options).replace(/\s/g, '');
          finalName += date;
        }

        link.download = `${finalName}.xlsx`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        resolve();
      } else {
        reject(new Error(`Failed to download file. Status: ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      reject(new Error('Network error during file download.'));
    };

    // Отправляем запрос
    xhr.send();
  });
}


export function downloadFile (url, host, type = 'xlsx') {
  const link = document.createElement('a');
  link.href = `${host}/public/${type}/${url}`;
  link.setAttribute('download', 'report.xlsx');
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

export function downloadJson(data, filename = 'file.json') {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const href = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}
