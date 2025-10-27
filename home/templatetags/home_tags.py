from django import template
from django.utils.safestring import mark_safe

register = template.Library()

@register.simple_tag
def carousel_assets():
    """Include CSS and JS assets for the hero carousel."""
    return mark_safe('''
        <link rel="stylesheet" type="text/css" href="/static/css/hero-carousel.css">
        <script type="text/javascript" src="/static/js/hero-carousel.js"></script>
    ''')

@register.simple_tag
def video_background_assets():
    """Include CSS and JS assets for the hero video background."""
    return mark_safe('''
        <link rel="stylesheet" type="text/css" href="/static/css/hero-video-background.css">
        <script type="text/javascript" src="/static/js/hero-video-background.js"></script>
    ''')

@register.simple_tag
def service_card_assets():
    """Include CSS assets for service cards."""
    return mark_safe('''
        <link rel="stylesheet" type="text/css" href="/static/css/service-card.css">
        <link rel="stylesheet" type="text/css" href="/static/css/service-cards.css">
    ''')