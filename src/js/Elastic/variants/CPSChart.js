import ElasticCharts from "@/js/Elastic/ElasticCharts";
import axios from "axios";

class CPSChart extends ElasticCharts{
  fetchData = async (data, date, timeRange) => {
    try {
      const response = await axios.post(
        this.url + this.projectUrl,
        data
      );

      if (response.data) {
        const buckets = response.data.aggregations['0'].buckets;

        if (!Array.isArray(buckets) || buckets.length === 0)   {
          return message.value = 'Bed data';
        }

        let intervalMillis;

        try {
          intervalMillis = buckets[1].key - buckets[0].key
        }catch (err){
          intervalMillis = this.calculateInterval(date, timeRange, true);
        }

        const dataForY = buckets.map((bucket) => {
          return bucket.doc_count / (intervalMillis / 1000);
        });

        return {
          error: false,
          messageError: '',
          data: {
            labels: buckets.map((bucket) => new Date(bucket.key_as_string)),
            datasets: [
              {
                label: 'Записей в секунду',
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                pointBackgroundColor: 'rgba(75,192,192,0)',
                pointBorderColor: 'rgba(75,192,192,0)',
                tension: 0.1,
                data: dataForY,
              },
            ],
          }
        }
      }else{
        return {
          error: true,
          messageError: 'Bed data',
          data: {}
        }
      }
    } catch (error) {
      return  {
        error: true,
        messageError: error.response?.data?.error?.type || 'Error',
        data: {}
      }
    }
  }

  getData = (date, timeRange, userId) => ({
    "aggs": {
      "0": {
        "date_histogram": {
          "field": "dt_call_start",
          "fixed_interval": this.calculateInterval(date, timeRange),
          "time_zone": "Asia/Singapore"
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
