from django.contrib.gis.forms.widgets import BaseGeometryWidget
from django.contrib.gis.forms.fields import GeometryField

__all__ = ["GeocodeSuggestWidget", "GeocodeSuggestPointField"]


class GeocodeSuggestWidget(BaseGeometryWidget):
    template_name = "geocode-suggest-widget.html"

    class Media:
        css = {
            "all": ["css/geocode-suggest.css"]
        }
        js = [
            "https://maps.googleapis.com/maps/api/js",
            "js/geocode-suggest.js",
        ]


class GeocodeSuggestPointField(GeometryField):
    geom_type = 'POINT'
    widget = GeocodeSuggestWidget
