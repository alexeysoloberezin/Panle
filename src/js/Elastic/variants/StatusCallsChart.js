import ElasticCharts from "@/js/Elastic/ElasticCharts";
import axios from "axios";

class CPSChart extends ElasticCharts {
  fetchData = async (data, inPrecents, autoInterval) => {
    try {
      const response = await axios.post(
        this.url + this.projectUrl,
        data
      );

      if (response.data) {
        const buckets = response.data.aggregations['0'].buckets;

        if (!Array.isArray(buckets)) return {error: true, messageError: 'Error DATA', data: []}
        if (buckets.length === 0) return {error: true, messageError: 'Данных нет', data: []}

        const operatorKeys = [...new Set(buckets.flatMap(bucket => bucket['1'].buckets.map(el => el.key_as_string)))];

        if(!inPrecents){
          return {
            error: false,
            messageError: '',
            data: {
              labels: operatorKeys.map((bucket) => new Date(bucket)),
              datasets: buckets.map((bucket, index) => ({
                label: `${bucket.key}`,
                backgroundColor: this.getColorMyNameStatus(bucket.key),
                data: operatorKeys.map((date) => {
                  const matchingBucket = bucket['1'].buckets.find((el) => el.key_as_string === date);
                  return matchingBucket ? matchingBucket.doc_count  : 0;
                }),
                stack: 'stack',
              }))
            }
          }
        }

        const totalRecords = {};
        const data = {}

        buckets.forEach(b => {
          b['1'].buckets.forEach(el => {
            if(data[el.key_as_string] === undefined){
              data[el.key_as_string] = {
                sum: el.doc_count,
                value: [el.doc_count]
              }
            }else{
              data[el.key_as_string] = {
                sum: data[el.key_as_string].sum + el.doc_count,
                value: [...data[el.key_as_string].value, el.doc_count]
              }
            }
          })
        })

        return {
          error: false,
          messageError: '',
          data: {
            labels: operatorKeys.map((bucket) => new Date(bucket)),
            datasets: buckets.map((bucket, index) => ({
              label: `${bucket.key}`,
              backgroundColor: this.getColorMyNameStatus(bucket.key),
              data: operatorKeys.map((date) => {
                const matchingBucket = bucket['1'].buckets.find((el) => el.key_as_string === date);
                return matchingBucket ? ((matchingBucket.doc_count / data[date].sum) * 100).toFixed(1)  : 0;
              }),
              stack: 'stack',
            }))
          }
        }


      }
    } catch (error) {
      return {
        error: true,
        messageError: error.response?.data?.error?.type || 'Error',
        data: {}
      }
    }
  }

  getData = (date, timeRange, userId) => ({
    "aggs": {
      "0": {
        "terms": {
          "field": "result.keyword",
          "order": {
            "_key": "desc"
          },
          "size": 99
        },
        "aggs": {
          "1": {
            "date_histogram": {
              "field": "dt_call_start",
              "fixed_interval": this.calculateInterval(date, timeRange),
              "time_zone": "Asia/Singapore"
            }
          }
        }
      }
    },
    "size": 0,
    "fields": [
      {
        "field": "@timestamp",
        "format": "date_time"
      },
      {
        "field": "dt_call_end",
        "format": "date_time"
      },
      {
        "field": "dt_call_start",
        "format": "date_time"
      },
      {
        "field": "dt_conv_start",
        "format": "date_time"
      },
      {
        "field": "end",
        "format": "date_time"
      },
      {
        "field": "start",
        "format": "date_time"
      }
    ],
    "script_fields": {},
    "stored_fields": [
      "*"
    ],
    "runtime_mappings": {},
    "_source": {
      "excludes": []
    },
    "query": {
      "bool": {
        "must": [],
        "filter": [
          ...[
            userId
            && {"bool": {
                "should": [
                  {
                    "match": {
                      "userid": userId
                    }
                  }
                ],
                "minimum_should_match": 1
              }}

          ],
          {
            "bool": {
              "should": [
                {
                  "match_phrase": {
                    "direction.keyword": "OUT"
                  }
                }
              ],
              "minimum_should_match": 1
            }
          },
          {
            "range": {
              "dt_call_start": {
                "format": "strict_date_optional_time",
                "gte": Array.isArray(date) && date.length > 1 ? date[0] : "",
                "lte": Array.isArray(date) && date.length > 1 ? date[1] : ""
              }
            }
          }
        ],
        "should": [],
        "must_not": []
      }
    }
  })
}

export default new CPSChart()
